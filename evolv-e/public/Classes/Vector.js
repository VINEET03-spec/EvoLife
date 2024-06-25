class Vector{                         
    constructor(x, y){//Initializes the vector with coordinates x and y
      this.x = x;                               
      this.y = y;
    }
    set(x,y) {//Sets the vector's coordinates to x and y.
        this.x = x;                            
        this.y = y;
    };
    magSq() {     //Returns the squared magnitude of the vector.          
        var x = this.x, y = this.y;
        return x * x + y * y;
    };
    mag(){    //Returns the magnitude of the vector          
        return Math.sqrt(this.magSq());
    };
    add(v) {           
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    sub(v) {                
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    subNew(v) {                
      var x = this.x - v.x;
      var y = this.y - v.y;
      return new Vector(x, y);
    };
    div(n) {                 
        this.x /= n;                           
        this.y /= n;
        return this;
    };
    mul(n) {               
        this.x *= n;                      
        this.y *= n;
        return this;
    };
    normalize() {  //Normalizes the vector (makes its magnitude 1)           
        return this.div(this.mag());        
    };
    setMag(n) {   //Sets the magnitude of the vector to n.             
        return this.normalize().mul(n);      
    };
    dist(v) {        //Returns the distance between this vector and another vector v     
        var d = v.copy().sub(this);          
        return d.mag();
    };
    limit(l) {      //Limits the magnitude of the vector to l.         
        var mSq = this.magSq();                 
        if(mSq > l*l) {                       
            this.div(Math.sqrt(mSq));
            this.mul(l);
        }
        return this;
    };
    headingRads() {     //      : Returns the angle of the vector in radians.
        var h = Math.atan2(this.y, this.x);
        return h;
    };
    headingDegs() { //: Returns the angle of the vector in degrees.         
        var r = Math.atan2(this.y, this.x);
        var h = (r * 180.0) / Math.PI;
        return h;
    };
    rotateRads(a) {     //Rotates the vector by a radians.     
        var newHead = this.headingRads() + a;   
        var mag = this.mag();
        this.x = Math.cos(newHead) * mag;
        this.y = Math.sin(newHead) * mag;
        return this;
    };
    rotateDegs(a) {     //Rotates the vector by a degrees.
        a = (a * Math.PI)/180.0;           
        var newHead = this.headingRads() + a;   
        var mag = this.mag();
        this.x = Math.cos(newHead) * mag;
        this.y = Math.sin(newHead) * mag;
        return this;
    };
    angleBetweenDegs(x,y) {  
        var r = this.angleBetweenRads(x,y);
        var d = (r * 180)/Math.PI;
        return d;
    }
    equals(x, y) {          
        var a, b;                    
        if (x instanceof Vector) {       
            a = x.x || 0;
            b = x.y || 0;
        } else {
            a = x || 0;
            b = y || 0;
        }

        return this.x === a && this.y === b;
    };
    copy(){
        return new Vector(this.x,this.y);   
    }                                        

}