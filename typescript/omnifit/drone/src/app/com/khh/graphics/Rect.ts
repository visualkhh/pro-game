export class Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;


  constructor(left: number  = 0, top: number = 0, right: number = 0, bottom: number = 0) {
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.top = top;
  }



  public isEmpty(): boolean {
    return this.left >= this.right || this.top >= this.bottom;
  }

    public width(): number {
        return this.right - this.left;
    }

    public height(): number {
        return this.bottom - this.top;
    }

    public centerX(): number {
        return (this.left + this.right) >> 1;
    }

    public centerY(): number {
        return (this.top + this.bottom) >> 1;
    }

    public exactCenterX(): number {
        return (this.left + this.right) * 0.5;
    }

    public exactCenterY(): number {
        return (this.top + this.bottom) * 0.5;
    }

    public setEmpty() {
      this.left = this.right = this.top = this.bottom = 0;
    }

    public set(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    // public set(src: Rect) {
    //     this.left = src.left;
    //     this.top = src.top;
    //     this.right = src.right;
    //     this.bottom = src.bottom;
    // }

    public offset(dx: number, dy: number) {
      this.left += dx;
      this.top += dy;
      this.right += dx;
      this.bottom += dy;
    }

    public offsetTo(newLeft: number, newTop: number) {
      this.right += newLeft - this.left;
      this.bottom += newTop - this.top;
      this.left = newLeft;
      this.top = newTop;
    }

    // public inset(dx: number, dy: number) {
    //   this.left += dx;
    //   this.top += dy;
    //   this.right -= dx;
    //   this.bottom -= dy;
    // }
    //
    // public inset(insets: Rect) {
    //   this.left += insets.left;
    //   this.top += insets.top;
    //   this.right -= insets.right;
    //   this.bottom -= insets.bottom;
    // }
    //
    // public void inset(int left, int top, int right, int bottom) {
    //     this.left += left;
    //     this.top += top;
    //     this.right -= right;
    //     this.bottom -= bottom;
    // }
    // public boolean contains(int x, int y) {
    //     return left < right && top < bottom  // check for empty first
    //            && x >= left && x < right && y >= top && y < bottom;
    // }
    // public boolean contains(int left, int top, int right, int bottom) {
    //            // check for empty first
    //     return this.left < this.right && this.top < this.bottom
    //            // now check for containment
    //             && this.left <= left && this.top <= top
    //             && this.right >= right && this.bottom >= bottom;
    // }
    //
    // public boolean contains(Rect r) {
    //            // check for empty first
    //     return this.left < this.right && this.top < this.bottom
    //            // now check for containment
    //            && left <= r.left && top <= r.top && right >= r.right && bottom >= r.bottom;
    // }


}

