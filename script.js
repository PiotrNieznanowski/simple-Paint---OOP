class Pencil {

    constructor(capSize, color) {
        this._drawing = false
        this._capSize = capSize || 5
        this._color = color || 'black'
    }

    onMouseMove(x, y, ctx) {
        if (this._drawing) {
            ctx.lineWidth = this._capSize
            ctx.lineCap = 'round'
            ctx.strokeStyle = this._color
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    onMouseUp(x, y, ctx) {
        this._drawing = false
        ctx.beginPath()
    }

    onMouseDown(x, y, ctx) {
        if (!this._drawing) {
            this._drawing = true
        }
    }

}
class Shape {

    constructor(size, color) {
        this._size = size || 20
        this._color = color || 'red'
    }

    onMouseMove(x, y, ctx) {

    }

    onMouseUp(x, y, ctx) {

    }

    onMouseDown(x, y, ctx) {
        ctx.strokeStyle = this._color
        ctx.strokeRect(x - this._size / 2, y - this._size / 2, this._size, this._size)
    }

}
class Brush {

    constructor(capSize, color) {
        this._drawing = false
        this._capSize = capSize || 5
        this._color = color || 'black'
    }

    onMouseMove(x, y, ctx) {console.log(1221)
        if (this._drawing) {
            ctx.lineWidth = this._capSize
            ctx.lineCap = 'round'
            ctx.strokeStyle = this._color
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    onMouseUp(x, y, ctx) {
        this._drawing = false
        ctx.beginPath()
    }

    onMouseDown(x, y, ctx) {
        if (!this._drawing) {
            this._drawing = true
        }
    }

}

class DrawingBoardUI {

    constructor(container, width, height) {
        this.currentTool = null
        this.attachCanvas(container, this.createCanvas(width, height))
    }

    createCanvas(width, height) {

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        canvas.addEventListener('touchmove', (e) => {
            if (this.currentTool) {
                e.preventDefault();
                var rect = e.target.getBoundingClientRect();
                this.currentTool.onMouseMove(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top, ctx)
            }
        })

        canvas.addEventListener('touchstart', (ev) => {
            if (this.currentTool) {
                this.currentTool.onMouseDown(ev.offsetX, ev.offsetY, ctx)
            }
        })

        canvas.addEventListener('touchend', (ev) => {
            if (this.currentTool) {
                this.currentTool.onMouseUp(ev.offsetX, ev.offsetY, ctx)
            }
        })
        canvas.addEventListener('mousemove', (ev) => {
            if (this.currentTool) {
                this.currentTool.onMouseMove(ev.offsetX, ev.offsetY, ctx)
            }
        })

        canvas.addEventListener('mousedown', (ev) => {
            if (this.currentTool) {
                this.currentTool.onMouseDown(ev.offsetX, ev.offsetY, ctx)
            }
        })

        canvas.addEventListener('mouseup', (ev) => {
            if (this.currentTool) {
                this.currentTool.onMouseUp(ev.offsetX, ev.offsetY, ctx)
            }
        })

  
    
        return canvas
    }

    attachCanvas(container, canvas) {
        const canvasElement = document.querySelector('canvas')
        if (canvasElement) {
            canvasElement.remove()
            document.querySelector(container).appendChild(canvas)
        } else {
            document.querySelector(container).appendChild(canvas)
        }
    }
    changeTool(tool) {
        this.currentTool = tool
    }
}

class ToolsFactory {

    constructor() {
        this.brush = new Brush(60, 'lightblue');
        this.pencil = new Pencil(15, 'yellow');
        this.shape = new Shape(60, 'silver');
    }

    getTool(tool) {
        switch (tool) {
            case 'BRUSH':
                return this.brush;
            case 'PENCIL':
                return this.pencil;
            case 'SHAPE':
                return this.shape;
        }
    }

}

const factory = new ToolsFactory()


class SubscribeActiveUI {

    constructor(subscribes) {
        this.tools = []
        this.subscribes = subscribes
    }
    createButtonActive(tool, toolName) {
        tool.addEventListener('touchstart', () => {
            this.subscribes(toolName)
        });
          tool.addEventListener('click', () => {
            this.subscribes(toolName)
        })
    }

    subscribe() {

        this.tools = [...document.querySelectorAll('.tool')]

        this.tools.forEach(x => {
            const toolName = x.getAttribute('data-tool')
            this.createButtonActive(x, toolName)
        })
    }
}


// addListener to size canvas
let board;
function myFunction(x) {
    if (x.matches) board = new DrawingBoardUI('.js-canvas', 300, 300);
    else board = new DrawingBoardUI('.js-canvas', 700, 700);
}
var x = window.matchMedia("(max-width: 700px)")
myFunction(x)
x.addListener(myFunction)


const tools = new SubscribeActiveUI(selectedTool => {
    let tool = factory.getTool(selectedTool);
    board.changeTool(tool);
})
tools.subscribe()
