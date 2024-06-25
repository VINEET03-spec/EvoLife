class Circular{
    constructor(x,y,r){ 
        this.x = x;
        this.y = y;
        this.r = r;
    }
    containsPoint(point){
        let xpoint = point.position.x;
        let ypoint = point.position.y;

        return(
            Math.sqrt(Math.pow(xpoint - this.x, 2) + Math.pow(ypoint - this.y, 2)) <= this.r 
        );
    }
   intercept(range){
        return !( 
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}