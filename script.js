// 環境變數

let bgColor = '#000'

// -----------
// Vec2
class Vec2{
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    set(x,y) {
        this.x = x
        this.y = y
    }
    add(v) {
        return new Vec2(this.x + v.x,this.y + v.y)
    }
    sub(v) {
        return new Vec2(this.x - v.x,this.y - v.y)
    }
    mul(s) {
        return new Vec2(this.x * s,this.y * s)
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    set length(nv) {
        let temp = this.unit.mul(nv)
        this.set(temp.x,temp.y)
    }
    clone() {
        return new Vec2(this.x,this.y)
    }
    toString() {
        return `${this.x},${this.y}`
    }
    equal(v) {
        return this.x === v.x && this.y === v.y
    }
    get angle() {
        return Math.atan2(this.y,this.x)
    }
    get unit() {
        return this.mul(1/this.length)
    }
}

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
ctx.circle = function(v,r,color) {
    this.beginPath()
    this.fillStyle = color
    this.arc(v.x,v.y,r,0,Math.PI*2)
    this.fill()
}
ctx.line = function(v1,v2) {
    this.moveTo(v1.x,v1.y)
    this.lineTo(v2.x,v2.y)
}
let ww
let wh
function initCanvas() {
    ww = canvas.width = window.innerWidth
    wh = canvas.height = window.innerHeight
}

function draw() {
    // 清空背景
    ctx.fillStyle = bgColor
    ctx.fillRect(0,0,ww,wh)
    // --------
    let degToPi = Math.PI/180
    // ----------
    // 在這裡繪製
    
    // 十字座標
    ctx.beginPath()
    ctx.line(new Vec2(0,wh/2),new Vec2(ww,wh/2))
    ctx.line(new Vec2(ww/2,0),new Vec2(ww/2,wh))
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.stroke()

    // 圓
    let delta = mousePos.sub(new Vec2(ww/2,wh/2))
    ctx.save()
        ctx.translate(ww/2,wh/2)

        ctx.beginPath()
        ctx.line(new Vec2(0,0),new Vec2(delta.x,delta.y))
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(0,0,delta.length,0,Math.PI*2)
        ctx.stroke()
        ctx.fillStyle = '#fff'
        ctx.fillText(parseInt(delta.angle/degToPi)+'度',10,-10)
        ctx.fillText('r='+delta.length,delta.length + 10,10)

        // 光
        ctx.save()
            ctx.beginPath()
            ctx.moveTo(0,0)
            ctx.rotate(delta.angle-10*degToPi)
            ctx.lineTo(delta.length,0)
            ctx.rotate(20*degToPi)
            ctx.lineTo(delta.length,0)
            ctx.fillStyle = '#ffcc60'
            ctx.fill()
        ctx.restore()

        // 敵人
        let enemies = [
            {r:100, angle: 45},
            {r:50, angle: -50},
            {r:250, angle: 160},
            {r:140, angle: -120},
        ]
        enemies.forEach(x => {
            ctx.save()
                ctx.beginPath()
                ctx.rotate(x.angle*degToPi)
                ctx.translate(x.r,0)
                let color = (Math.abs(x.angle*degToPi-delta.angle) <10*degToPi && delta.length > x.r) ? 'red' : '#fff'
                ctx.circle(new Vec2(0,0),5,color)
            ctx.restore()
        })
    ctx.restore()

    // 滑鼠十字
    ctx.save()
    ctx.beginPath()
    ctx.circle(mousePos,3,'red')
    ctx.translate(mousePos.x,mousePos.y)
        ctx.strokeStyle = 'red'
        let len = 20
        ctx.line(new Vec2(-len,0),new Vec2(len,0))
        ctx.fillText(mousePos,10,-10)
        ctx.rotate(Math.PI/2)
        ctx.line(new Vec2(-len,0),new Vec2(len,0))
        ctx.stroke()
    ctx.restore()

    requestAnimationFrame(draw)
}
function loaded() {
    initCanvas()
    requestAnimationFrame(draw)
}

let mousePos = new Vec2(0,0)
window.addEventListener('load',loaded)
window.addEventListener('resize',initCanvas)
window.addEventListener('mousemove',mousemove)

function mousemove(e) {
    mousePos.set(e.x,e.y)
}