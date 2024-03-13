interface Line {
  x: number;
  y: number;
  brushSettings: BrushSettings;
}

interface BrushSettings {
  size: number;
  color: string;
  lineCap: CanvasLineCap;
}

export default class Canvas {
  brushSettings: BrushSettings = {
    size: 5,
    color: 'rgb(0,0,0)',
    lineCap: 'round'
  }
  lineTypes: string[] = ['butt', 'round', 'square'];
  canvasData: Line[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isCanvasReady: boolean = true;
  private isMouseDown: boolean = false;

  constructor(canvasNode: HTMLCanvasElement) {
    this.canvas = canvasNode;
    this.ctx = this.canvas.getContext('2d')!;
  }

  flushCanvasData() {
    this.canvasData.length = 0
  }

  startLine(evt: MouseEvent) {
    const currentPosition = this.getMousePos(this.canvas, evt);
    this.isMouseDown = true;
    this.isCanvasReady = false;
    this.ctx.moveTo(currentPosition.x, currentPosition.y);
    this.ctx.beginPath();
    this.ctx.lineWidth  = this.brushSettings.size;
    this.ctx.strokeStyle = this.brushSettings.color;
    this.ctx.lineCap = this.brushSettings.lineCap;
  }

  drawLine(evt: MouseEvent) {
    if (this.isMouseDown) {
      const currentPosition = this.getMousePos(this.canvas, evt);
      this.ctx.lineTo(currentPosition.x, currentPosition.y);
      this.ctx.stroke();
      this.canvasData.push({
        x: currentPosition.x,
        y: currentPosition.y,
        brushSettings: this.brushSettings
      });
    }
  }

  finishLine() {
    this.isMouseDown = false;
    this.isCanvasReady = true;
  }
  
  async renderLinesData(data: string) {
    const isReady = await this.checkCanvasReady();
    const lines = JSON.parse(data);
    if (isReady) {
      this.isCanvasReady = false;
      if (lines.length === 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(lines[0].x, lines[0].y);
        this.ctx.lineWidth  = lines[0].brushSettings.size;
        this.ctx.strokeStyle = lines[0].brushSettings.color;
        this.ctx.lineCap = lines[0].brushSettings.lineCap;
        this.ctx.lineTo(lines[0].x, lines[0].y);
        this.ctx.stroke();
      } else {
        for (let i = 1; i < lines.length; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(lines[i-1].x, lines[i-1].y);
          this.ctx.lineWidth  = lines[i].brushSettings.size;
          this.ctx.strokeStyle = lines[i].brushSettings.color;
          this.ctx.lineCap = lines[i].brushSettings.lineCap;
          this.ctx.lineTo(lines[i].x, lines[i].y);
          this.ctx.stroke();
        }
      }
      this.isCanvasReady = true;
    }
  }

  private checkCanvasReady(): Promise<Error|true> {
    return new Promise((resolve) => this.waitCanvasReady(resolve));
  }

  private waitCanvasReady(resolve) {
    if (this.isCanvasReady) {
      resolve(true);
    } else {
      setTimeout(() => { this.waitCanvasReady(resolve) }, 100);
    }
  }

  private getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}