export class CanvasData {
  private data: string[] = [];

  public addData(data: string): void {
    this.data.push(data);
  }

  public getData(): string[] {
    return this.data;
  }

  public clear(): void {
    this.data = [];
  }
}
