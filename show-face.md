







[TOC]



### 一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？

主要包括一下几个基本步骤：

1. DNS域名解析：浏览器向DNS服务器发起请求，解析url中域名对应的ip地址
2. 建立TCP连接：解析出ip地址后，根据ip地址和默认80端口，和服务器建立TCP连接
3. 发起http请求：浏览器发起读取文件的http请求
4. 服务器响应请求并返回结果：服务器对浏览器请求做出响应，并把对应的html文件发送给浏览器
5. 关闭TCP连接：通过4次挥手释放TCP连接
6. 浏览器渲染：客户端解析HTML内容并渲染出来，浏览器接受到数据包后的解析流程为：
   - 构建dom树：词法分析然后解析成dom树，
   - 构建css规则树：生成css规则树
   - 构建render树：浏览器将dom树和css树结合，并构建出渲染树
   - 布局：计算出每个节点在屏幕中的位置
   - 绘制：即遍历render树，并使用ui后端层绘制出每个节点





1. DNS解析URL对应的IP

2. 根据IP建立TCP连接（3次握手）

3. HTTP发起请求

4. 服务器处理请求

5. 浏览器接受http响应

6. 关闭tcp连接（4次挥手）

7. 构建dom树，渲染页面

   

   https://blog.csdn.net/sinat_23880167/article/details/78882766

https://blog.csdn.net/yorcentroll/article/details/118691688

### TCP的三次握手和四次挥手

- ###### 三次握手：

第一次握手：建立连接时，客户端发送syn包（syn=j）到服务器，并进入sync_send状态，等待服务器确认

第二次握手：服务器接收到syn包，必须确认客户的syn（ack = j + 1），同时自己也发送一个syn包（syn = k），即syn + ack包，此时服务器进入syn_recv状态

第三次握手：客户端接收到服务器的syn + ack包，向服务器发送确认包ack（ack = k + 1），此包发送完毕，客户端和服务器进入established状态，完成三次握手。

完成三次握手，客户端与服务端开始传输数据。

- ###### 四次挥手：

第一次挥手：客户端A发送一个fin，用来关闭客户端A到服务器B的数据传送

第二次挥手：服务器B收到这个fin，它返回一个ack，确认序号为收到的序号+1.和syn一样，一个fin将占用一个序号

第三次挥手：服务器B关闭与客户端A的链接，发送一个fin给客户端A

第四次挥手：客户端A发回ack报文确认，并将确认序号设置为序号+1

### 浏览器强缓存和协商缓存

- **强缓存**

使用强缓存时，如果缓存资源有效，则直接使用缓存资源，不必再向服务器发起请求。

强缓存策略可以通过两种方式来设置，分别是http头信息中的Expires属性和Cache-Control属性

- **协商缓存**

如果命中强制缓存，我们无需发起新的请求，直接使用缓存内容，如果没有命中强制缓存，如果设置了协商缓存，这个时候协商缓存就会发挥作用了

命中协商缓存的条件有2个：

1.max-age=xxx过期了

2.值为no-store

使用协商缓存时，会先向服务器发送一个请求，如果资源没有发生修改，则返回一个304状态，让浏览器使用本地的缓存副本。如果资源发生了修改，则返回修改后的资源

### 浏览器过程：

浏览器第一次加载资源，服务器返回200，浏览器从服务器下载资源文件，并缓存资源文件与response header，以供下次加载时对比使用；

下一次加载资源时，由于强缓存优先级别较高，先比较当前时间与上一次返回200时的时间差，如果没有超过cache-control设置的max-age，则没有过期，并命中强缓存，直接从本地读取资源。如果浏览器不支持HTTP1.1，则使用expires头判断是否过期；

如果资源过期，则表明强制缓存没有命中，则开始协商缓存，向服务器发送带有if-None-Match和if-modified-Since的请求；

服务器接受到请求后，优先根据Etag的值判断被请求的文件有没有做修改，Etag值一致则没有修改，命中协商缓存，返回304；如果不一致则有改动，直接返回新的资源文件带上Etag值并返回200

如果服务器收到的请求没有Etag值，则将if-Modify-Since和被请求文件的最后修改时间做比对，一致则命中协商缓存，返回304；不一致则将返回新的last-modified和文件并返回200

### 

### http和https

http是客户端和服务器端请求和应答的标准，用于从www服务器传输超文本到本地浏览器的超文本传输协议

https：是以安全为目标的http通道，即在http下加入ssl层进行加密。其作用是建立一个信息安全通道，来确保数据的传输，确保网站的真实性。

### http和https的区别及优缺点

- http是超文本传输协议，信息是明文传输，https协议要比http安全，https是具有安全性得ssl加密传输协议，可防止数据在传输过程中被窃取，修改，确保数据得完整性。

- http协议得默认端口是80，https默认端口是443

- http的连接很简单，是无状态的，https握手阶段很费时，会使页面加载时间延长50%，增加10%-20%的耗电

- https缓存不如http高效，会增加数据开销
- https协议需要ca证书，费用较高，
- ssl证书需要绑定ip，不能在同一个ip上绑定多个域名，ipv4资源支持不了这种消耗

### TCP和UDP的区别

TCP是面向连接的，UDP是面向无连接的

TCP仅支持单播传输，UDP提供了单播、多播和广播的功能

TCP的三次握手保证了数据传输的可靠性，UDP是无连接的、不安全的一种信息传输协议，首先不安全性体现在他是无连接的，接受到的信号都不需要发送确认信息，发送端不知道数据是否会正确接收。

UDP的头部开销比TCP小，数据传输速率更好，实时性更好。

### 说一下http缓存策略，有什么区别，分别解决了什么问题

**1）浏览器缓存策略**

浏览器每次发起请求时，先在本地缓存中查找结果以及缓存标识，根据缓存标识来判断是否使用本地缓存。如果缓存有效，则使用本地缓存；否则，则向服务器发起请求并携带缓存标识。根据是否需向服务器发起HTTP请求，将缓存过程划分为两个部分：
强制缓存和协商缓存，强缓优先于协商缓存。

- 强缓存，服务器通知浏览器一个缓存时间，在缓存时间内，下次请求，直接用缓存，不在时间内，执行比较缓存策略。
- 协商缓存，让客户端与服务器之间能实现缓存文件是否更新的验证、提升缓存的复用率，将缓存信息中的Etag和Last-Modified
  通过请求发送给服务器，由服务器校验，返回304状态码时，浏览器直接使用缓存。

HTTP缓存都是从第二次请求开始的：

- 第一次请求资源时，服务器返回资源，并在response header中回传资源的缓存策略；
- 第二次请求时，浏览器判断这些请求参数，击中强缓存就直接200，否则就把请求参数加到request header头中传给服务器，看是否击中协商缓存，击中则返回304，否则服务器会返回新的资源。这是缓存运作的一个整体流程图：

!![http缓存](C:\Users\mingtai.liu\Desktop\face\img\http缓存.png)

**2）强缓存**

- 强缓存命中则直接读取浏览器本地的资源，在network中显示的是from memory或者from disk
- 控制强制缓存的字段有：Cache-Control（http1.1）和Expires（http1.0）
- Cache-control是一个相对时间，用以表达自上次请求正确的资源之后的多少秒的时间段内缓存有效。
- Expires是一个绝对时间。用以表达在这个时间点之前发起请求可以直接从浏览器中读取数据，而无需发起请求
- Cache-Control的优先级比Expires的优先级高。前者的出现是为了解决Expires在浏览器时间被手动更改导致缓存判断错误的问题。
  如果同时存在则使用Cache-control。

**3）强缓存-expires**

- 该字段是服务器响应消息头字段，告诉浏览器在过期时间之前可以直接从浏览器缓存中存取数据。
- Expires 是 HTTP 1.0 的字段，表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)。在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。
- 由于是绝对时间，用户可能会将客户端本地的时间进行修改，而导致浏览器判断缓存失效，重新请求该资源。此外，即使不考虑修改，时差或者误差等因素也可能造成客户端与服务端的时间不一致，致使缓存失效。
- 优势特点
  - 1、HTTP 1.0 产物，可以在HTTP 1.0和1.1中使用，简单易用。
  - 2、以时刻标识失效时间。
- 劣势问题
  - 1、时间是由服务器发送的(UTC)，如果服务器时间和客户端时间存在不一致，可能会出现问题。
  - 2、存在版本问题，到期之前的修改客户端是不可知的。

**4）强缓存-cache-control**

- 已知Expires的缺点之后，在HTTP/1.1中，增加了一个字段Cache-control，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求。
- 这两者的区别就是前者是绝对时间，而后者是相对时间。下面列举一些 `Cache-control` 字段常用的值：(完整的列表可以查看MDN)
  - `max-age`：即最大有效时间。
  - `must-revalidate`：如果超过了 `max-age` 的时间，浏览器必须向服务器发送请求，验证资源是否还有效。
  - `no-cache`：不使用强缓存，需要与服务器验证缓存是否新鲜。
  - `no-store`: 真正意义上的“不要缓存”。所有内容都不走缓存，包括强制和对比。
  - `public`：所有的内容都可以被缓存 (包括客户端和代理服务器， 如 CDN)
  - `private`：所有的内容只有客户端才可以缓存，代理服务器不能缓存。默认值。
- **Cache-control 的优先级高于 Expires**，为了兼容 HTTP/1.0 和 HTTP/1.1，实际项目中两个字段都可以设置。
- 该字段可以在请求头或者响应头设置，可组合使用多种指令：
  - 可缓存性：
    - public：浏览器和缓存服务器都可以缓存页面信息
    - private：default，代理服务器不可缓存，只能被单个用户缓存
    - no-cache：浏览器器和服务器都不应该缓存页面信息，但仍可缓存，只是在缓存前需要向服务器确认资源是否被更改。可配合private，
      过期时间设置为过去时间。
    - only-if-cache：客户端只接受已缓存的响应
  - 到期
    - max-age=：缓存存储的最大周期，超过这个周期被认为过期。
    - s-maxage=：设置共享缓存，比如can。会覆盖max-age和expires。
    - max-stale[=]：客户端愿意接收一个已经过期的资源
    - min-fresh=：客户端希望在指定的时间内获取最新的响应
    - stale-while-revalidate=：客户端愿意接收陈旧的响应，并且在后台一部检查新的响应。时间代表客户端愿意接收陈旧响应
      的时间长度。
    - stale-if-error=：如新的检测失败，客户端则愿意接收陈旧的响应，时间代表等待时间。
  - 重新验证和重新加载
    - must-revalidate：如页面过期，则去服务器进行获取。
    - proxy-revalidate：用于共享缓存。
    - immutable：响应正文不随时间改变。
  - 其他
    - no-store：绝对禁止缓存
    - no-transform：不得对资源进行转换和转变。例如，不得对图像格式进行转换。
- 优势特点
  - 1、HTTP 1.1 产物，以时间间隔标识失效时间，解决了Expires服务器和客户端相对时间的问题。
  - 2、比Expires多了很多选项设置。
- 劣势问题
  - 1、存在版本问题，到期之前的修改客户端是不可知的。

**5）协商缓存**

- 协商缓存的状态码由服务器决策返回200或者304
- 当浏览器的强缓存失效的时候或者请求头中设置了不走强缓存，并且在请求头中设置了If-Modified-Since 或者 If-None-Match 的时候，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回 304 状态，加载浏览器缓存，并且响应头会设置 Last-Modified 或者 ETag 属性。
- 对比缓存在请求数上和没有缓存是一致的，但如果是 304 的话，返回的仅仅是一个状态码而已，并没有实际的文件内容，因此 在响应体体积上的节省是它的优化点。
- 协商缓存有 2 组字段(不是两个)，控制协商缓存的字段有：Last-Modified/If-Modified-since（http1.0）和Etag/If-None-match（http1.1）
- Last-Modified/If-Modified-since表示的是服务器的资源最后一次修改的时间；Etag/If-None-match表示的是服务器资源的唯一标
  识，只要资源变化，Etag就会重新生成。
- Etag/If-None-match的优先级比Last-Modified/If-Modified-since高。

**6）协商缓存-协商缓存-Last-Modified/If-Modified-since**

- 1.服务器通过 `Last-Modified` 字段告知客户端，资源最后一次被修改的时间，例如 `Last-Modified: Mon, 10 Nov 2018 09:10:11 GMT`
- 2.浏览器将这个值和内容一起记录在缓存数据库中。
- 3.下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的 `Last-Modified` 的值写入到请求头的 `If-Modified-Since` 字段
- 4.服务器会将 `If-Modified-Since` 的值与 `Last-Modified` 字段进行对比。如果相等，则表示未修改，响应 304；反之，则表示修改了，响应 200 状态码，并返回数据。
- 优势特点
  - 1、不存在版本问题，每次请求都会去服务器进行校验。服务器对比最后修改时间如果相同则返回304，不同返回200以及资源内容。
- 劣势问题
  - 2、只要资源修改，无论内容是否发生实质性的变化，都会将该资源返回客户端。例如周期性重写，这种情况下该资源包含的数据实际上一样的。
  - 3、以时刻作为标识，无法识别一秒内进行多次修改的情况。 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒。
  - 4、某些服务器不能精确的得到文件的最后修改时间。
  - 5、如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

**7）协商缓存-Etag/If-None-match**

- 为了解决上述问题，出现了一组新的字段 `Etag` 和 `If-None-Match`
- `Etag` 存储的是文件的特殊标识(一般都是 hash 生成的)，服务器存储着文件的 `Etag` 字段。之后的流程和 `Last-Modified` 一致，只是 `Last-Modified` 字段和它所表示的更新时间改变成了 `Etag` 字段和它所表示的文件 hash，把 `If-Modified-Since` 变成了 `If-None-Match`。服务器同样进行比较，命中返回 304, 不命中返回新资源和 200。
- 浏览器在发起请求时，服务器返回在Response header中返回请求资源的唯一标识。在下一次请求时，会将上一次返回的Etag值赋值给If-No-Matched并添加在Request Header中。服务器将浏览器传来的if-no-matched跟自己的本地的资源的ETag做对比，如果匹配，则返回304通知浏览器读取本地缓存，否则返回200和更新后的资源。
- **Etag 的优先级高于 Last-Modified**。
- 优势特点
  - 1、可以更加精确的判断资源是否被修改，可以识别一秒内多次修改的情况。
  - 2、不存在版本问题，每次请求都回去服务器进行校验。
- 劣势问题
  - 1、计算ETag值需要性能损耗。
  - 2、分布式服务器存储的情况下，计算ETag的算法如果不一样，会导致浏览器从一台服务器上获得页面内容后到另外一台服务器上进行验证时现ETag不匹配的情况。

### 防抖和节流

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5

**1）防抖**

- 触发高频事件后n秒内函数只会执行一次，如果n秒内再次触发，则重新计算时间

- 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

```html
<div id="container"></div>
```

```css
#container{
  width: 100%; height: 200px; line-height: 200px; text-align: center; color: #fff; background-color: #444; font-size: 30px;
}
```

```javascript
// self do：
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

```javascript
function debounce(fn) {
      let timeout = null; // 创建一个标记用来存放定时器的返回值
      return function () {
        clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
        timeout = setTimeout(() => { 
         // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
          fn.apply(this, arguments);
        }, 500);
      };
    }
    function sayHi() {
      console.log('防抖成功');
    }

    var inp = document.getElementById('inp');
    inp.addEventListener('input', debounce(sayHi)); // 防抖

```



https://github.com/mqyqingfeng/Blog/issues/22

**2)节流**

- 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率

- 持续触发事件，每隔一段时间，只执行一次事件



```javascript
function throttle(fn) {
      let canRun = true; // 通过闭包保存一个标记
      return function () {
        if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
        canRun = false; // 立即设置为false
        setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
          fn.apply(this, arguments);
          // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
          canRun = true;
        }, 500);
      };
    }
    function sayHi(e) {
      console.log(e.target.innerWidth, e.target.innerHeight);
    }
    window.addEventListener('resize', throttle(sayHi));

```

https://github.com/mqyqingfeng/Blog/issues/26

### · Proxy 相比于 defineProperty 的优势?

Object.definePorperty的优势主要有3个：

- 不能监听数组的变化
- 必须遍历对象的每个属性
- 必须深层遍历嵌套的对象。

Proxy优点：

- 针对对象，而不是对象的属性，因此就不需要对key进行遍历，解决了Object.defineproperty（）必须遍历对象的每个属性的问题
- 支持数组：Proxy不需要对数组的方法进行重载，减少了代码，等于时降低了维护成本。

### vue3.0里为什么要用Proxy Api代替defineProperty Api？--响应式优化

**1）defineProperty Api的局限性最大的原因是它只能针对单例属性做监听**

- vue2.x中的响应式原理正式基于defineProperty的descriptor，对data中的属性做了遍历+递归，为每个属性设置了getter和setter。

- 这也是为什么vue只能针对data中预定义过的属性做出响应的原因，在vue中使用下标的方式直接修改属性的值或者添加一个预先不存在的对象属性，是无法做到setter监听的，这是defineProperty的局限性。

**2）Proxy Api的监听是针对一个对象的，那么对这个对象的所有操作回进入监听操作，这就完全可以代理所有属性，将会带来很大的性能提升和更优的代码**

- Proxy可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，一次提供了一种机制，可以对外界的访问进行过滤和改写。

**3）响应式是惰性的**

在vue2.x中，对于一个深层属性嵌套的对象，要劫持它内部深层次的变化，就需要递归遍历这个对象，执行Object.defineProperty把每一层对象数据都贬称响应式的，这无疑会有很大的性能消耗

在vue3.0中，使用Proxy Api并不能监听到对象内部深层次的属性变化，因此它的处理方式是在getter中去递归响应式，这样的好处是真正访问到的内部属性才会变成响应式，简单的可以说是按需实现响应式，减少性能消耗



### vue3.0编译做了哪些优化（底层，源码）

**1)生成Block tree**

- vue2.0的数据更新并触发重新渲染的力度是组件级的，单个组件内部，需要遍历该组件的整个vnode树。

​		在2.0里，渲染效率的快慢与组件大小成正相关，组件越大，渲染效率越慢。

- vue3.0做到了通过编译阶段对静态模板的分析，编译生成了Block tree。

​		Block tree是一个将模板基于动态节点指令切割的嵌套区块，每个区块内部的节点结构是固定的，每个区块只需要追踪自身包含的动态节点。

​		所以在3.0里，渲染效率不再与模板大小成正小关，而是与模板中动态节点的数量成正相关。

![](C:\Users\mingtai.liu\Desktop\house\block.jpg)

**2)slot编译优化**

- vue2.x中，如果有一个组件传入了slot，那么每次父组件更新的时候，会强制子组件update，造成性能浪费。

- vue3.0优化了slot的生成，是的非动态slot中属性的更新只会触发子组件的更新。

​		动态slot指的是在slot上面使用v-if、v-for，动态slot名字等会导致slot产生运行时动态变化但是又无法被子组件track的操作

3）diff算法优化



### Vue3.0是如何变得更快的（底层，源码）

**1）diff方法优化**

- vue2.x中的虚拟dom是进行全量的对比

- vue3.0中新增了静态标记（PatchFlag）：

​		在与上次虚拟节点进行对比的时候，只对比带有patch flag的节点，并且可以通过flag的信息得知当前节点要对比的具体内容

**2）hoistStatic静态提升**

- vue2.x：无论元素是否参与更新，每次都会重新创建

- vue3.0：对不参与更新的元素，只会被创建一次，之后会在每次渲染的时候被不停的复用

**3）cacheHndlers事件侦听器缓存**

- 默认情况下onClick会被是为动态绑定，所以每次都会去追踪它的变化，但是因为是同一个函数，所以没有追踪变化，直接缓存起来服用即可。



### Vue3在性能方面的提升

1.编译阶段，对diff算法优化、静态提升等等

2.响应式系统。Proxy()替代Object.defineProperty()监听对象。监听一个对象，不需要再深度遍历，Proxy就可以劫持整个对象

3.体积包减少。Composition API的写法，可以更好的进行tree shaking，减少上下文没有引入的代码，减少打包后的文件提交

4.新增片段特性。Vue文件的<template>标签内，不再需要强制声明一个标签，节省额外的节点开销。



### 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6



### 对闭包的看法，为什么要用闭包？说一下闭包原理以及应用场景

**1）什么是闭包**

函数执行后返回结果是一个内部函数，并被外部变量所引用，如果内部函数持有被执行函数作用域的变量，即形成了闭包。

可以在内部函数访问到外部函数作用域。使用闭包，一可以读取函数中的变量，二可以将函数中的变量存储在内存中，保护变量不被污染。而正因闭包会把函数中的变量值存储在内存中，会对内存有消耗，所以不能滥用闭包，否则会影响网页性能，造成内存泄漏。当不需要使用闭包时，要及时释放内存，可将内层函数对象的变量赋值为null。

**2）闭包原理**

函数执行分成两个阶段(预编译阶段和执行阶段)。

- 在预编译阶段，如果发现内部函数使用了外部函数的变量，则会在内存中创建一个“闭包”对象并保存对应变量值，如果已存在“闭包”，则只需要增加对应属性值即可。
- 执行完后，函数执行上下文会被销毁，函数对“闭包”对象的引用也会被销毁，但其内部函数还持用该“闭包”的引用，所以内部函数可以继续使用“外部函数”中的变量

利用了函数作用域链的特性，一个函数内部定义的函数会将包含外部函数的活动对象添加到它的作用域链中，函数执行完毕，其执行作用域链销毁，但因内部函数的作用域链仍然在引用这个活动对象，所以其活动对象不会被销毁，直到内部函数被烧毁后才被销毁。

**3）优点**

1. 可以从内部函数访问外部函数的作用域中的变量，且访问到的变量长期驻扎在内存中，可供之后使用
2. 避免变量污染全局（保护函数的私有变量不受外部的干扰，形成不销毁的栈内存）
3. 把变量存到独立的作用域，作为私有成员存在（保存，把一些函数内的值保存下来，闭包可以实现方法和属性的私有化）

**4）缺点**

1. 对内存消耗有负面影响。因内部函数保存了对外部变量的引用，导致无法被垃圾回收，增大内存使用量，所以使用不当会导致内存泄漏
2. 对处理速度具有负面影响。闭包的层级决定了引用的外部变量在查找时经过的作用域链长度
3. 可能获取到意外的值(captured value)

**5）应用场景**

**应用场景一：** 典型应用是模块封装，在各模块规范出现之前，都是用这样的方式防止变量污染全局。



````javascript
var Yideng = (function () {
    // 这样声明为模块私有变量，外界无法直接访问
    var foo = 0;

    function Yideng() {}
    Yideng.prototype.bar = function bar() {
        return foo;
    };
    return Yideng;
}());
```
````

**应用场景二：** 在循环中创建闭包，防止取到意外的值。

如下代码，无论哪个元素触发事件，都会弹出 3。因为函数执行后引用的 i 是同一个，而 i 在循环结束后就是 3

```javascript
for (var i = 0; i < 3; i++) {
    document.getElementById('id' + i).onfocus = function() {
      alert(i);
    };
}
//可用闭包解决
function makeCallback(num) {
  return function() {
    alert(num);
  };
}
for (var i = 0; i < 3; i++) {
    document.getElementById('id' + i).onfocus = makeCallback(i);
}

```

**使用场景三**：防抖和节流，函数柯里化

### 垂直居中的多种写法



```html
<div class="container">
   <div class="box"></div>
 </div>
```

```css
.container {
    width: 100%;
    height: 100%;
    background: pink
}
```

1.弹性盒子法

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

2.绝对定位 + 计算法

```css
.container {
    position: relative;
}
.box {
    position: absolute;
    left: calc(50% - 150px);   /* 减去宽度的一半 */
    top: calc(50% - 150px)		/* 减去高度的一半 */
}
```

3.margin: auto 法(1)

```css
.container {
    position: relative
}
.box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto
}
```



4.负magin法

```css
.container {
    position: relative
}
.box {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -150px; /* 宽度的一半 */
    margin-top: -150px;  /* 高度的一半 */
}
```



5.弹性盒子 + margin：auto法

```css
.container {
    display: flex;
    text-align: center
}
.box {
    margin: 
        
}
```



### new的过程

伪代码表示：

```javascript
var a = new myFunction('Li', 'Cherry')
new myFunction {
    var obj = {}
    obj.__proto__ = myFunction.prototype
    var result = myFunction.call(obj, 'Li', 'Cherry')
    return typeof result === 'obj' ? result : obj
}
```

1.创建一个空对象obj；

2.将新创建的空对象的隐式原型指向其构造函数的显示原型；

3.使用call改变this的指向；

4.如果无返回值或者返回一个非对象值，则将obj返回作为新对象；如果返回值是一个新对象的话那么则直接返回该对象。

所以，我们可以看到，在new的过程中，我是是使用call改变了this的指向。



### js new一个对象的过程，实现一个简单的new方法

对于大部分前端开发者而言，new一个构造函数或类得到对应实例，是非常普遍的操作了。下面的例子中分别通过构造函数与class类实现了一个简单的创建实例的过程。

```javascript
// ES5构造函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};
const child = new Parent('test', 26);
child.sayName() //'test'


// ES6 class类
class Parent {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayName() {
        console.log(this.name);
    }
};
const child = new Parent('test', 26);
child.sayName() //test
```

**一、new操作中发生了什么**

比较直观的感觉，<u>当我们new一个构造函数，得到的实例继承里构造器的构造属性（this.name这些）以及原型上的属性</u>。

在《JavaScript模式》这本书中，new的过程说的比较直白，当以new操作符调用构造函数时,函数内部将会发生以下情况：

<u>• 创建一个空对象，并且this变量引用了该对象，同时还继承了该函数的原型</u>

<u>• 属性和方法被添加至this引用的对象中</u>

<u>• 新创建的对象由this所引用，并且最后隐式的返回this（如果没有显示的返回其他的对象）</u>

简单描述即为：

1. 创建一个空对象
2. 继承构造函数的原型
3. this指向obj，并调用构造函数
4. 返回对象

简单实现new：

```javascript
function myNew (fn, ...args) {
    // 第一步：创建一个空对象
    const obj = {}

    // 第二步：继承构造函数的原型
    obj.__proto__ =  fn.prototype

    // 第三步：this指向obj，并调用构造函数
    fn.apply(obj, args)


    // 第四步：返回对象
    return obj
}

```



我们改写上面的例子，大概就是这样：

```javascript
// ES5构造函数
let Parent = function (name, age) {
    // 1.创建一个新对象，赋予this，这一步是隐性的，
    // let this = {};
    // 2.给this指向的对象赋予构造属性
    this.name = name;
    this.age = age;
    // 3.如果没有手动返回对象，则默认返回this指向的这个对象，也是隐性的
    // return this;
};
const child = new Parent();
```

将this赋予一个新的变量(例如that)，最后返回这个变量：

```javascript
// ES5构造函数
let Parent = function (name, age) {
   	let that = this;
    that.name = name;
    that.age = age;
    return that;
};
const child = new Parent('test', '26');
```

**this的创建与返回是隐性的**，手动返回that的做法；这也验证了隐性的这两步确实是存在的。

**二、实现一个简单的new方法（winter大神）**

• 以构造器的prototype属性为原型，创建新对象；

• 将this(也就是上一句中的新对象)和调用参数传给构造器，执行；

• 如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。

new过程中会**新建对象**，此对象会继承**构造器的原型与原型上的属性**，最后它会被**作为实例返回**这样一个过程。

```javascript
// 构造器函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};
// 自己定义的new方法
let newMethod = function (Parent, ...rest) {
    // 1.以构造器的prototype属性为原型，创建新对象；
    let child = Object.create(Parent.prototype);
    // 2.将this和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3.如果构造器没有手动返回对象，则返回第一步的对象
    return typeof result  === 'object' ? result : child;
};
// 创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod(Parent, 'echo', 26);
child.sayName() //'echo';

// 最后检验，与使用new的效果相同
child instanceof Parent//true
child.hasOwnProperty('name')//true
child.hasOwnProperty('age')//true
child.hasOwnProperty('sayName')//false
```



### 请简单叙述一下原型链s 从prototype、隐式的_proto_、constructor再到修改原型链的内容会导致的影响

https://blog.csdn.net/handsomexiaominge/article/details/92170314?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.no_search_link&spm=1001.2101.3001.4242.1



### 请简单说一下promise机制 异步的承诺机制、顺势说了一下解决回调地狱的问题



### 如何改变this的指向， 当然是call、aplly、bind，紧接着问了一个这之间的区别

手写bind

https://juejin.cn/post/7031793667492806670

手写promise.all

手写new操作符

手写发布订阅模式

### 箭头函数与普通函数的区别

1. 箭头函数不可作为构造函数，不能使用new
2. 箭头函数没有自己的this
3. 箭头函数没有arguments对象
4. 箭头函数没有原型对象

### 说一下如何实现闭包





https://zhuanlan.zhihu.com/p/73046285

1. ### 介绍一下原型链  https://juejin.cn/post/6844903989088092174

   https://juejin.cn/post/7007416743215759373

   ### js的作用域和作用域链

   **作用域：**

   在js中，作用域分为`全局作用域`和`函数作用域`

   - 全局作用域：代码在程序任何地方都能访问，window对象的内置书信都属于全局作用域
   - 函数作用域：在固定的代码片段才能被访问

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc495bd8b13437993c4da3a52fe6803~tplv-k3u1fbpfcp-watermark.awebp?)

   作用域与上下级关系，上下级关系的确定就看函数实在哪个作用域下创建的。如上，fn作用域下创建了bar函数，那么‘fn作用域’就是‘bar作用域’的上级

   作用域最大的用处就是隔离变量，不用作用域下同名变量不会有冲突.

   

   **作用域链：**

   一般情况下，变量取值到创建这个变量的作用域中取值

   但是如果在当前作用域中没有查到值，就会向上级作用域去查，知道查到全局作用域，这么一个查找过程形成的链条就叫做作用域链

   ```javascript
   
   var x = 10;
   
   function fn(){
       console.log(x);
   }
   
   function show(f){
       var x = 20;
       f();    // 10 
   }
   
   show(fn);
   
   ```

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc9141580e90438c8fc54a8888e77554~tplv-k3u1fbpfcp-watermark.awebp?)

2. ### 介绍一下前端的继承方式

3. ### undefine与null的区别

4. ### HTTP，TCP，七层网络结构，讲一下

5. ### chrome 浏览器最多同时加载多少个资源，那如果想同时加载更多资源应该怎么办

6. ### http2 的多路复用是什么原理

7. ### 实现一个改变 this 指向的 call 方法，介绍一下原理

8. ### 跨域

9. ### 解 JSON Web Token 么，它和其他的鉴权方式有什么区别

10. ### 网络安全有了解么，CSRF 如何防御，SameSite 有哪几个值

11. ### 对 TDD 的看法是怎样的

12. ### 移动端一套代码适配多端是如何做的

13. ### 如果用户希望自己定义一个颜色生成对应的皮肤，应该怎么制定方案

14. ### Vue 和 React 的区别      https://jishuin.proginn.com/p/763bfbd551b5

15. ### Vue 和 React 的 Diff 算法有哪些区别

16. ### 编写一个方法，判断一个字符串是否是合法的 XML

17. ### 浏览器缓存机制

     https://blog.csdn.net/weixin_47254130/article/details/113574185?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0.no_search_link&spm=1001.2101.3001.4242.1

18. ### 节流和防抖的原理是什么

19. ### 事件循环介绍一下

20. ### 0.1 + 0.2 为什么不等于 0.3，为什么会有误差，如何解决

    ### 大数加法如何实现

    ### v-for 为什么会有 key

    ### 为什么 vue 的 data 用一个函数而不是一个对象

    ### 虚拟 DOM 介绍一下

    ### diff 算法介绍一下

    ### webpack 和 Vite 的区别，迁移过程是怎么样的

    ### 前端工程化你是怎么理解的

    ### vue 和 react 都看过哪些部分源码，v-model 的原理是什么，虚拟 dom 的优缺点是什么

    ### typescript 相比 JavaScript 的优点是什么

    ### export 和 module.exports 的区别

    ### node 的内存泄露是如何监控的

    ### node 读取文件的时候，fs.readFile 和 stream 有什么区别

    1. Vue 兄弟组件传值方式都有哪些

    2. 介绍一下 Vuex

    3. 介绍一下 diff 算法

    4. Websocket 介绍一下，它和 http 有什么关系

    5. 介绍一下 https

    6. 写一共获取URL后的参数的方法

    7. 换肤方案你们具体是如何实现的

    8. localstorage的会不会出现不同项目的key覆盖别人的key的问题，如何解决

    9. roxy和defineProperty的区别是什么，各自的优势和缺点是什么

       浏览器发请求和node发请求都有什么区别，浏览器都为发请求做了哪些默认行为

       如何理解线程和进程

       为什么Vite比webpack快很多，ESM和commonJS的区别是什么，为什么ESM加载会更快，如何理解ESM的静态

       都做过哪些打包的优化

       在CI/CD中都需要做哪些事情可以把流程做得更好

       浏览器请求头和响应头都能记起哪些，都是做什么的

       协商缓存与强缓存

       响应头和跨域相关都有哪些，之前都是如何解决跨域的

       Access-Control-Allow-Origin用 * 和指定域名的区别是什么

       跨域是否允许携带cookie，如果希望携带cookie需要如何做，如果a.com是我的域名，向b.com发请求，带的是哪个域名的cookie

       请求头的host，origin，refer的区别是什么

       在什么场景下会发起options请求

       !important在什么场景用，css选择器权重是如何计算的

       盒模型的边距叠加，如何解决盒子塌陷，如何创建BFC

       ==和===的区别，a==1&&a==2有什么方式让它返回true

       Object.create(null)和直接创建一个{}有什么区别

       new一个函数做了哪些事

       对事件循环的理解

       Vue和React源码读过哪些部分，印象最深刻的是哪些

       简单介绍以下Vue-router的原理

       diff算法简单介绍一下

       前端工程化做过哪些

       如何做到的逐步减少项目中的typescript报错

       写过webpack插件么

       babel转换的原理是什么

       性能优化做过哪些

       离线存储是如何做的

       都用过哪些设计模式

       对线上各类异常如何处理，对线上的静态资源加载失败如何捕获

       node多进程间通信是如何做的

       koa中间件原理实现是如何做的

       如何界定一个依赖包的安全性

       node做过哪些性能优化

       

       1. Vue和React的区别，项目是如何做选型的


       作者：刮涂层_赢大奖
       链接：https://juejin.cn/post/7036581158670303240
       来源：稀土掘金
       著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


       作者：刮涂层_赢大奖
       链接：https://juejin.cn/post/7036581158670303240
       来源：稀土掘金
       著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


​    

### 什么情况算是跨域？如何解决跨域问题？

### 一个有序的数组进行查找操作？（手写） 别说了，二分查找开始吧

### 对虚拟DOM的理解？虚拟DOM主要做了什么？虚拟DOM本身是什么？

**一、什么是虚拟DOM**

从本质上来说，Virtual Dom是一个javascript对象，通过对象的方式来表示DOM结构。将页面的状态抽象为对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。

虚拟dom是对DOM的抽象，这个对象是 更加轻量级的对DOM的描述。它涉及的最初目的，就是更好的跨平台，比如node.js就没有DOM，如果向实现SSR，那么一个方式就是借助虚拟dom，因为虚拟dom本身是js对象。

在代码渲染到页面前，vue或者react会把代码转换成一个对象（虚拟DOM）。以对象的形式来描述真实dom结构，最终渲染到页面。在每次数据发生变化前，虚拟dom都会缓存一份，变化之时，现在的虚拟dom会与缓存的虚拟dom进行比较。

在vue或者react内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

另外现在全段架构的一个基本要求就是无需手动操作DOM，一方面是因为手动操作DOM无法保证程序性能，多人协作的项目中如果review不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动DOM操作可以大大提高开发效率

**二、为什么要用Virtual DOM**

1.保证性能下限，在不进行手动优化的情况下，提供过得去的性能

​	看一下页面渲染的一个流程：

解析HTML---生成DOM---生成CSS DOM---Layout---Paint---Compiler

https://github.com/lgwebdream/FE-Interview/issues/920

### 首屏加载和首屏优化

计算首屏加载时间：

```javascript
times = (performance.timing.domComplete - performance.timing.navigationStart) / 1000
```

1. 减少入口文件体积，常用的比如路由懒加载，只有在解析路由时才加载组件

2. 静态资源本地缓存

   - 后端返回资源：采用http缓存
   - 前端合理利用localstorage
   - CDN静态资源缓存

3. UI框架按需加载

4. 避免组件重复打包

   假设A.js文件是一个常用的库，现在多个路由使用A.js文件，这样就造成重复下载

   解决方案：在webpack的config文件夹中，修改Co'm'mo'n'sChun'kPlugin的配置miniChunks:2

   ​					miniChunks为2会把使用2次以上的包抽离出来，放进公共依赖文件中，避免了重复加载组件

5. 图片资源压缩：

   - 对于页面上使用的icon，可以使用在线字体图标，或者雪碧图，将众多的小图标合并到一张图上，用以减轻http请求的压力

6. 开启Gzip压缩：compress-webpack-plugin







### 如何编写一个loader

### webpack的构建流程事什么？从读取配置道输出文件这个过程尽可能讲全

1. 初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译
3. 确定入口：根据配置中的entry找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有依赖的文件都经过了本步骤的处理
5. 完成模块编译：在经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成

### webpack祖国哪些优化，挨罚效率方面、打包策略方面等等

**1）优化webpack得构建速度**

- 使用高版本的webpack（使用webpack4甚至webpack5）

- 多线程/多实例构建：HappyPack（不维护了）、thread-loader

- 缩小打包作用域：

  -  exclude/include（确定loader规则范围）

  - resolve.modules 指明第三方模块的绝对路径（减少不必要的查找）

  - resolve.extensions 尽可能减少后缀尝试的可能性

  - noParse 对完全不需要解析的库进行忽略（不去解析但仍会打包到bundle中，注意别忽略的文件里不应该包含import、require、defing等模块化语句）

  - IgnorePlugin（完全排除模块）

  合理使用alias

- 充分利用缓存提升二次构建速度

  - babel-loader开启缓存

    babel-loader在执行的时候，可能会产生一些运行期间重复的公告文件。造成代码体积大冗余，同时也会减慢编译效率

    可以加上cacheDirectory参数或者使用transform-runtion插件试试

    ```javascript
    // webpack.config.js中
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // 开启babel缓存
                    // 第二次构建时，会读取之前的缓存
                    cacheDirectory: true
                }
            }
        ]
    }
    ```

    

  - terser-webpack-plugin开启缓存

  - 使用cache-loader或者hard-source-webpack-plugin

    注意：thread-loader和cache-loader两个要一起用的话，请先放cache-loader，接着是thread-loader，最后才是heavy-loader	

- DLL

  - 使用DllPlugin进行分包，使用DllReferencePlugin(索引链接)对mainfest.json引用，让一些基本不会改动的代码先打包城静态资源，避免反复编译浪费时间。

**2）使用webpack4-优化原因**

- V8带来的优化（for of 替代forEach、Map和Set替代Object、includes替代indexOf）
- 默认使用更快的md4 hash算法
- webpack AST可以直接从loader传递给AST，减少解析时间
- 使用字符串方法替代正则表达式

noParse

- 不去解析某个库内部的依赖关系

- 比如jquery这个库是独立的，则不去解析这个库内部依赖的其他的东西

- 在独立库的时候可以使用

  ```javascript
  module.exports = {
      module: {
          noParse: /jquery/,
          rules: []
      }
  }
  ```

IgnorePlugin

- 忽略掉某些内容，不去解析依赖库内部引用的某些内容

- 从moment中引用./local则忽略掉

- 如果要用local的话，则必须在项目中手动引入import 'monent/locale/zh-cn'

  ```javascript
  module.exports = {
      plugins: [
          new Webpack.IgnorePlugin(/./local/, /moment/),
      ]
  }
  ```

  

### MVVM和MVC是什么？有什么区别

**MVC：**

- Model（模型）：负责从数据库取数据
- View(视图)：负责展示数据的地方
- Controller(控制器)：用户交互的地方，例如点击事件等等
- 思想：Controller将Model的数据展示在View上

**MVVM：**

- VM：ViewMode，做了两件事，达到了数据的双向绑定

​		  一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：绑定。

​		  二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM事件监听。

- 思想：实现了View和Model的自动同步，也就是当Model的属性改变时，我们不用再自己手动操作DOM元素，来改变View的显示，而是改变属性后，该属性对应View层显示会自动改变（对应Vue数据驱动的思想）

**区别：**

整体看来，MVVM和MVC精简很多，不仅简化了业务与界面的依赖，还解决了数据频繁更新的问题，不用再用选择器操作DOM元素。因为再MVVM中，View不知道Model的存在，Model和ViewModel也观察不到View，这种低耦合模式提高代码的可复用性。



Vue是MVVM框架，但是，不是严格符合MVVM，因为MVVM规定Model和View不能直接通信，而Vue的ref可以做到这点



### 为什么data是个函数并且返回一个对象

是因为一个组件可能会多出调用，而每一调用就会执行data函数，并返回新的数据对象，这样，可以避免多次调用之间的数据污染。



- ### 路由有哪些模式？有什么不同？

- hash模式：通过#号后面的内容的更改，触发hashchange事件，实现路由切换

- history模式：通过pushState和replaceState切换url，触发popstate事件，实现路由切换，需要后端配合



### 前端路由和后端路由有什么区别？



### Vue响应式是怎么实现的

vue通过数据劫持结合发布者订阅者模式，通过Object.defineProperty()来劫持各个属性的getter和setter，当数据发生变化时，发消息给各个订阅者，触发相应的监听回调。

对象内部通过defineReactive方法，使用Obejct.defineProperty将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。当页面使用对应属性时，每个属性都拥有自己的dep属性，存放它所依赖的watcher（依赖收集），当属性变化后，会通知自己对应的watcher去更新（派发更新）。

源码系列：https://juejin.cn/column/6969563635194527758

### Vue组件渲染和更新的过程是什么？

### Vue2.x中的this为啥指向vue实例

1. methods里的方法通过bind指定了this为new Vue的实例（vm），methods里的函数也都定义在vm上了，所以可以直接通过this访问到methods里面的函数
2. data函数返回的数据对象也都存储在了mew Vue的实例（vm）上的_data上了，访问this.name时实际访问的时Object.defineProperty代理后的this._data.name。

https://juejin.cn/post/7054841260820922376?utm_source=gold_browser_extension

### Vue.set方法的原理

```javascript
function set(target, key, val) {
    // 判断是否是数组
    if (Array.isArray(target)) {
        // 判断谁大谁小
        target.length = Math.max(target.length, key)
        // 执行splice
        target.splice(key, 1, val)
        return val
    }

    const ob = target.__ob__

    // 如果此对象没有不是响应式对象，直接设置并返回
    if (key in target && !(key in target.prototype) || !ob) {
        target[key] = val
        return val
    }

    // 否则，新增属性，并响应式处理
    defineReactive(target, key, val)
    return val
}

```



### Vue为什么要用虚拟Dom

- 虚拟Dom就是用js对象来描述真是Dom，是对真实Dom的抽象
- 由于直接操作Dom性能低，但是js层的操作效率高，可以将Dom操作转化成对象操作最终通过diff算法比对差异进行更新Dom
- 虚拟Dom不依赖真实平台环境，可以实现跨平台



### Vue的diff算法原理是什么

- 先比较两个节点是不是相同节点
- 相同节点比较属性，复用老节点
- 先比较耳机节点，考虑老节点和新节点儿子的情况
- 优化比较：头头、尾尾、头尾、尾头
- 比对查找，进行复用



### 组件的渲染过程

产生组件虚拟节点--->创建组件的真实节点--->插入到页面

![](C:\Users\mingtai.liu\Desktop\js-demo\b060c176af4d41a4abd60dc7edced2d8_tplv-k3u1fbpfcp-watermark.webp)

### 描述组件的更新流程

属性更新会触发patchVnode方法，组件的虚拟节点会调用prepatch钩子，然后更新属性，更新组件

![](C:\Users\mingtai.liu\Desktop\js-demo\c5a19f7f110f441faa0aff053e3ed06a_tplv-k3u1fbpfcp-watermark.webp)



### 组件写name有什么好处

- 增加name属性，会在components属性中增加组件本身，实现组件的递归调用
- 可以表示足迹的具体名称，方便调试和查找对应组件



### Vue diff算法

首先，我们拿到新旧节点的数组，然后初始化4个指针，分别指向新旧节点的开始位置和结束位置，进行两两对比。

若是新的开始节点和旧的开始节点相同，则都向后面移动，

若是结尾节点相匹配，则都前移指针，

若是新开始节点和就结尾节点匹配上了，则会将旧的结束点移动到旧的开始节点前；

若是旧开始节点和新的结束节点相匹配，则会将旧开始节点移动到旧结束节点的后面

若是上述节点都没有匹配上，则会进行一个兜底逻辑的判断，判断开始节点是否在旧节点中，若是存在则复用，若是不存在则创建。

最终跳出循环，进行裁剪或者新增。

若是旧的开始节点旧的结束节点，则会删除之间的节点，反之则是新增新的开始节点到新的结束节点

vue的diff算法是深度优先遍历还是广度有限算法===》在patchVnode过程中会调用updateChildren，所以vue的diff算法是个深度优先算法。

https://juejin.cn/post/7013193754349666335



谈谈vue的性能优化有哪些

- 数据层级不要过深，合适的设置响应式数据
- 不要将所有的数据放在data中，（静态数据放在外面），data中的数据都会增加getter和setter，会收集对应的watcher，这样会降低性能。
- 使用数据时，缓存值得结果，不频繁取值
- 合理设置key
- 尽可能拆分组件，来提高复用性、提高代码的可维护性，减少不必要的渲染。
- v-show（频繁切换性能高）和v-if得合理使用
- 合理使用路由懒加载，
- 图片懒加载
- 控制组件得粒度--->vue采用组件级别更新
- 采用函数式组件--->函数式组件开销低
- 采用异步组件--->借助webpack得分包策略
- 使用keep-alive来缓存组件
- 虚拟滚动、时间分片策略等
- 打包优化



### 为何Vue采用异步 渲染（核心的方法就是nextTick）

vue是组件级更新，组件内有数据变化时，该组件就会更新。例如：this.a = 1, this.b = 2 (同一个watcher)

(1) 原因：如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染。所有为了性能考虑，vue会在本轮数据更新后，在取异步更新视图。而不是每当	 有数据	 更新，就立即更新视图。

(2) 过程： 

- vue是异步执行dom更新的，一旦观察到数据，vue就会开启一个队列，然后把同一个事件循环（event loop）中观察到数据变化的watcher推送进这个队列。
- 如果这个watcher被触发多次，只会被推送到队列一i。这种缓冲行为可以有效的去掉重复数据，避免不必要的计算和dom操作。
- 而在下一个事件循环时，vue会情空队列，并进行必要的dom更新。

(3)源码解析：

- 数据变化时，通过notify通知watcher进行更新操作；

- 通过subs[i].update依次调用watcher的update（未更新视图）；

- 将watcher方队队列中，在queueWatcher会根据watcher的id进行去重（多个属性依赖一个watcher），如果队列中没有该watcher，就会将该watcher添加到队列中（未更新视图）

- 通过nextTick异步执行flushSchedulerQueue方法刷新watcher队列（更新视图）

  

![异步更新](C:\Users\mingtai.liu\Desktop\face\img\异步更新.png)

### 判断是否是数组的方法

https://blog.csdn.net/weixin_34279061/article/details/88674722

- Object.prototype.toString

用法：Object.prototype.toString.call(arr) === '[object, Array]'

虽然Array也继承自Object，但js在Array.prototype上重写了toString，而我们通过toString.call(arr)实际上是通过原型链调用了

```javascript
let arr = [];
console.log(Object.prototype.toString.call(arr) === '[object Array]'); // true
```

- Array.isArray

```javascript
let arr = [];
console.log(Array.isArray(arr)); // true
```

- Array原型链上的isPrototypeOf

用法：Array.prototype.isPrototypeOf(arr)

Array.prototype属性表示Array构造函数的原型

其中一个方法是isPrototypeOf()用于测试一个对象是否存在于另一个对象的原型链上

```javascript
let arr = []
console.log(Array.prototype.isPrototypeOf(arr))  // true
```

- Object.getPrototypeOf

用法：Object.getPrototypeOf(arr) === Array.ptotoyype

Object.getPrototypeOf()方法返回指定对象的原型

```javascript
let arr = []
Object.getPrototypeOf(arr) === Array.prototype // true
```



为什么a标签中使用img后高度多了几个像素

因为img是行内元素，默认display:inline，它与文本的默认行为类似，下边缘与基线对齐，而不是紧贴容器下边缘，将display设置block即可消除上面
