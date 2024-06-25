//The QuadTree class is a data structure used to partition a 2D space into smaller regions, allowing for efficient querying of points within that space. Your implementation includes methods for inserting various types of objects (points, foods, herbivores, and carnivores) and querying these objects within specific regions
class QuadTree{
    constructor(limit, capacity){
        this.limit = limit; // The bounding rectangle of the QuadTree
        this.capacity = capacity; // / The maximum number of objects each QuadTree can hold before subdividing
        this.points = [];
        this.foods = [];
        this.herbivores = [];
        this.carnivores = [];
        this.divided = false;
    }
    // Subdivide the QuadTree into 4 child rectangles
    subdivide(){
        let x = this.limit.x;
        let y = this.limit.y;
        let w = this.limit.w;
        let h = this.limit.h;

        let ne = new  Rectangle(x + w/2, y - h/2, w/2, h/2);
        this.northeast = new QuadTree(ne, this.capacity);

        let no = new  Rectangle(x - w/2, y - h/2, w/2, h/2);
        this.northwest = new QuadTree(no, this.capacity);

        let se = new  Rectangle(x + w/2, y + h/2, w/2, h/2);
        this.southeast = new QuadTree(se, this.capacity);

        let so = new  Rectangle(x - w/2, y + h/2, w/2, h/2);
        this.southwest = new QuadTree(so, this.capacity);
        this.divided = true;

    }

    insertPoint(point){

        if(!this.limit.containspoint(point)){
             // Checks if the point is contained within the limits of the root rectangle   
               return false;
        }

        if(this.points.length < this.capacity){
            this.points.push(point);
            return true;
        } else{ 
            if(!this.divided){ 
                this.subdivide();
            }
              if(this.northeast.insertPoint(point)){
                return true;
            } else if(this.northwest.insertPoint(point)){
                return true;
            } else if(this.southeast.insertPoint(point)){
                return true;
            } else if(this.southwest.insertPoint(point)){
                return true;
            };            
        }
    }

    insertfood(food){
        if(!this.limit.containspoint(food)){ // Checks if the food is contained within the limits of the root rectangle           
             return false;
        }

        if(this.foods.length < this.capacity){ 
            this.foods.push(food); 
            return true;
        } else{          
            if(!this.divided){
                this.subdivide();
            }
            if(this.northeast.insertfood(food)){
                return true;
            } else if(this.northwest.insertfood(food)){
                return true;
            } else if(this.southeast.insertfood(food)){
                return true;
            } else if(this.southwest.insertfood(food)){
                return true;
            };            
        }
    }

    insertherbivore(herbivore){
        if(!this.limit.containspoint(herbivore)){
            return false;
        }

        if(this.herbivores.length < this.capacity){ 
            this.herbivores.push(herbivore);
            return true;
        } else{
            if(!this.divided){ 
                this.subdivide();
            } if(this.northeast.insertherbivore(herbivore)){
                return true;
            } else if(this.northwest.insertherbivore(herbivore)){
                return true;
            } else if(this.southeast.insertherbivore(herbivore)){
                return true;
            } else if(this.southwest.insertherbivore(herbivore)){
                return true;
            };            
        }
    }

    insertcarnivore(carnivore){
        if(!this.limit.containspoint(carnivore)){
            return false;
        }
        
        if(this.carnivores.length < this.capacity){ 
            this.carnivores.push(carnivore); 
            return true;
        } else{ 
            if(!this.divided){ 
                this.subdivide();
            }         
            if(this.northeast.insertcarnivore(carnivore)){
                return true;
            } else if(this.northwest.insertcarnivore(carnivore)){
                return true;
            } else if(this.southeast.insertcarnivore(carnivore)){
                return true;
            } else if(this.southwest.insertcarnivore(carnivore)){
                return true;
            };            
        }
    }

    searchpoints(range, found){ // Search for points within a given range
        if(!found){
            found = [];
        }
        if(!this.limit.intercept(range)){ 
            return;
        } else{ 
            for(let p of this.points){ 
                if(range.containspoint(p)){ 
                    found.push(p);
                }
            }

            if(this.divided){
                this.northwest.searchpoints(range, found); 
                this.northeast.searchpoints(range, found); 
                this.southwest.searchpoints(range, found); 
                this.southeast.searchpoints(range, found);
            }

            return found;
        }
    }

    searchfoods(circle, found){
        if(!found){
            found = [];
        }
        if(!this.limit.intercept(circle)){ 
            return found;
        } else{
            for(let a of this.foods){ 
                if(circle.containspoint(a)){ 
                    found.push(a);
                }
            }

            if(this.divided){ 
                this.northwest.searchfoods(circle, found); 
                this.northeast.searchfoods(circle, found); 
                this.southwest.searchfoods(circle, found); 
                this.southeast.searchfoods(circle, found);
            }

            return found;
        }
    }

    searcherbivores(circle, found){
        if(!found){
            found = [];
        }
        if(!this.limit.intercept(circle)){
            return found;
        } else{ 
            for(let h of this.herbivores){ 
                if(circle.containspoint(h)){ 
                    found.push(h);
                }
            }

            if(this.divided){
                this.northwest.searcherbivores(circle, found); 
                this.northeast.searcherbivores(circle, found); 
                this.southwest.searcherbivores(circle, found); 
                this.southeast.searcherbivores(circle, found);
            }

            return found;
        }
    }

    searchcarnivores(circle, found){
        if(!found){
            found = [];
        }
        if(!this.limit.intercept(circle)){ 
            return found;
        } else{ 
            for(let c of this.carnivores){ 
                if(circle.containspoint(c)){ 
                    found.push(c);
                }
            }

            if(this.divided){ 
                this.northwest.searchcarnivores(circle, found); 
                this.northeast.searchcarnivores(circle, found); 
                this.southwest.searchcarnivores(circle, found); 
                this.southeast.searchcarnivores(circle, found);
            }

            return found;
        }
    }

    draw(){
        c.beginPath();
        c.rect(this.limit.x - this.limit.w, this.limit.y - this.limit.h, this.limit.w*2, this.limit.h*2);
        c.stroke();
        if(this.divided){
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }
    }

    
}