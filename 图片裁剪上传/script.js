document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const sourceCanvas = document.getElementById('sourceCanvas');
    const previewCanvas = document.getElementById('previewCanvas');
    const cropBox = document.getElementById('cropBox');
    const cropButton = document.getElementById('cropButton');
    const editButton = document.getElementById('editButton');
    const resultCanvas = document.getElementById('resultCanvas');
    const croppedResult = document.querySelector('.cropped-result');
    const mainImage = document.querySelector('.main-image');
    const previewDiv = document.querySelector('.preview');

    // 状态变量
    let image = null;
    let isDragging = false;
    let isResizing = false;
    let currentHandle = null;
    
    // 实际坐标和尺寸（相对于原始图片）
    let realX = 0;
    let realY = 0;
    let realWidth = 200;
    let realHeight = 200;
    
    // 拖动和调整大小时的临时变量
    let startX = 0;
    let startY = 0;
    let startRealX = 0;
    let startRealY = 0;
    let startRealWidth = 0;
    let startRealHeight = 0;
    
    // 缩放比例
    let scale = 1;

    // 添加状态变量
    let lastCropState = null;

    // 处理图片上传
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
            document.querySelector('.main-image').classList.remove('has-image');
            // 重置UI状态
            mainImage.style.display = 'block';
            previewDiv.style.display = 'block';
            croppedResult.style.display = 'none';
            cropButton.style.display = 'inline-block';
            editButton.style.display = 'none';
            lastCropState = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            image = new Image();
            image.onload = function() {
                // 设置画布大小为原始图片大小
                sourceCanvas.width = image.width;
                sourceCanvas.height = image.height;
                
                // 计算缩放比例
                scale = sourceCanvas.offsetWidth / image.width;
                
                // 绘制原始图片
                const ctx = sourceCanvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                // 初始化裁剪框
                realX = 0;
                realY = 0;
                realWidth = Math.min(200, image.width);
                realHeight = Math.min(200, image.height);
                
                // 设置预览容器的初始宽度
                const previewContainer = document.querySelector('.preview');
                previewContainer.style.width = (realWidth * scale) + 'px';
                
                updateCropBoxStyle();
                updatePreview();

                // 添加有图片的标记类
                document.querySelector('.main-image').classList.add('has-image');
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 处理鼠标按下事件
    cropBox.addEventListener('mousedown', function(e) {
        const handle = e.target.getAttribute('data-handle');
        
        if (handle) {
            // 开始调整大小
            isResizing = true;
            currentHandle = handle;
            startX = e.clientX;
            startY = e.clientY;
            startRealX = realX;
            startRealY = realY;
            startRealWidth = realWidth;
            startRealHeight = realHeight;
        } else {
            // 开始拖动
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startRealX = realX;
            startRealY = realY;
        }
        e.preventDefault();
        e.stopPropagation();
    });

    // 处理鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        if (!image) return;

        if (isResizing) {
            // 计算实际位移（相对于原始图片）
            const deltaX = (e.clientX - startX) / scale;
            const deltaY = (e.clientY - startY) / scale;
            
            // 临时变量存储新的位置和尺寸
            let newX = startRealX;
            let newY = startRealY;
            let newWidth = startRealWidth;
            let newHeight = startRealHeight;

            // 根据不同的调整手柄计算新的位置和尺寸
            switch (currentHandle) {
                case 'nw':
                    newX = startRealX + deltaX;
                    newY = startRealY + deltaY;
                    newWidth = startRealWidth - deltaX;
                    newHeight = startRealHeight - deltaY;
                    break;
                case 'n':
                    newY = startRealY + deltaY;
                    newHeight = startRealHeight - deltaY;
                    break;
                case 'ne':
                    newY = startRealY + deltaY;
                    newWidth = startRealWidth + deltaX;
                    newHeight = startRealHeight - deltaY;
                    break;
                case 'e':
                    newWidth = startRealWidth + deltaX;
                    break;
                case 'se':
                    newWidth = startRealWidth + deltaX;
                    newHeight = startRealHeight + deltaY;
                    break;
                case 's':
                    newHeight = startRealHeight + deltaY;
                    break;
                case 'sw':
                    newX = startRealX + deltaX;
                    newWidth = startRealWidth - deltaX;
                    newHeight = startRealHeight + deltaY;
                    break;
                case 'w':
                    newX = startRealX + deltaX;
                    newWidth = startRealWidth - deltaX;
                    break;
            }

            // 应用约束条件
            if (isValidCrop(newX, newY, newWidth, newHeight)) {
                realX = newX;
                realY = newY;
                realWidth = newWidth;
                realHeight = newHeight;
                updateCropBoxStyle();
                updatePreview();
            }
        } else if (isDragging) {
            // 计算新位置
            const deltaX = (e.clientX - startX) / scale;
            const deltaY = (e.clientY - startY) / scale;
            const newX = startRealX + deltaX;
            const newY = startRealY + deltaY;

            // 检查是否在有效范围内
            if (isValidCrop(newX, newY, realWidth, realHeight)) {
                realX = newX;
                realY = newY;
                updateCropBoxStyle();
                updatePreview();
            }
        }
    });

    // 处理鼠标松开事件
    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
        currentHandle = null;
    });

    // 验证裁剪框是否在有效范围内
    function isValidCrop(x, y, width, height) {
        const minSize = 50; // 最小尺寸
        
        return (
            width >= minSize &&
            height >= minSize &&
            x >= 0 &&
            y >= 0 &&
            x + width <= image.width &&
            y + height <= image.height
        );
    }

    // 更新裁剪框样式
    function updateCropBoxStyle() {
        cropBox.style.width = (realWidth * scale) + 'px';
        cropBox.style.height = (realHeight * scale) + 'px';
        cropBox.style.left = (realX * scale) + 'px';
        cropBox.style.top = (realY * scale) + 'px';
    }

    // 更新预览
    function updatePreview() {
        if (!image) return;

        // 设置预览画布的尺寸为实际裁剪尺寸
        previewCanvas.width = realWidth;
        previewCanvas.height = realHeight;

        // 更新预览容器的宽度以匹配裁剪框
        const previewContainer = document.querySelector('.preview');
        previewContainer.style.width = (realWidth * scale) + 'px';

        const ctx = previewCanvas.getContext('2d');
        ctx.drawImage(
            sourceCanvas,
            realX,
            realY,
            realWidth,
            realHeight,
            0,
            0,
            realWidth,
            realHeight
        );
    }

    // 处理窗口大小改变
    window.addEventListener('resize', function() {
        if (!image) return;
        
        scale = sourceCanvas.offsetWidth / image.width;
        updateCropBoxStyle();
    });

    // 裁剪按钮点击事件
    cropButton.addEventListener('click', function() {
        if (!image) return;
        
        // 保存当前裁剪状态
        lastCropState = {
            x: realX,
            y: realY,
            width: realWidth,
            height: realHeight
        };

        // 显示裁剪结果
        resultCanvas.width = realWidth;
        resultCanvas.height = realHeight;
        const ctx = resultCanvas.getContext('2d');
        ctx.drawImage(
            sourceCanvas,
            realX,
            realY,
            realWidth,
            realHeight,
            0,
            0,
            realWidth,
            realHeight
        );

        // 更新UI显示
        mainImage.style.display = 'none';
        previewDiv.style.display = 'none';
        croppedResult.style.display = 'block';
        cropButton.style.display = 'none';
        editButton.style.display = 'inline-block';

        // 设置裁剪结果容器的宽度
        croppedResult.style.width = (realWidth * scale) + 'px';
    });

    // 重新编辑按钮点击事件
    editButton.addEventListener('click', function() {
        if (!lastCropState) return;

        // 恢复之前的裁剪状态
        realX = lastCropState.x;
        realY = lastCropState.y;
        realWidth = lastCropState.width;
        realHeight = lastCropState.height;

        // 更新UI显示
        mainImage.style.display = 'block';
        previewDiv.style.display = 'block';
        croppedResult.style.display = 'none';
        cropButton.style.display = 'inline-block';
        editButton.style.display = 'none';

        // 更新裁剪框和预览
        updateCropBoxStyle();
        updatePreview();
    });
}); 