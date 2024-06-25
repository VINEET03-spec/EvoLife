class Rectangle{
    constructor(x,y,w,h){ // Initializes the rectangle with the center coordinates (x, y), half-width w, and half-height h.
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    containsPoint(point){//Checks if a point is within the rectangle. The point is expected to have a position property with x and y coordinates.
        return(
            point.position.x >= this.x - this.w &&
            point.position.x <= this.x + this.w &&
            point.position.y >= this.y - this.h &&
            point.position.y <= this.y + this.h
        );
    }
    intercept(range){//Checks if this rectangle intersects with another rectangle range. The range is another Rectangle object.
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
    intercept(circle){//Checks if this rectangle intersects with a circle. The circle is expected to have properties x, y, and r (radius)
        let testX = circle.x;
        let testY = circle.y;
        if (circle.x < this.x - this.w){
            testX = this.x - this.w;
        } else if (circle.x > this.x + this.w){
            testX = this.x + this.w; 
        }

        if (circle.y < this.y - this.h){
            testY = this.y - this.h;
        } else if (circle.y > this.y + this.h){
            testY = this.y + this.h;
        }
        let distX = circle.x - testX;
        let distY = circle.y - testY;
        let distance = Math.sqrt((distX*distX) + (distY*distY));
        if (distance <= circle.r) {
            return true;
        }
        return false;
    }
}