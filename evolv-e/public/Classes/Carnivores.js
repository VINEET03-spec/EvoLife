class Carnivores extends Organisms{
    static carnivores = [];
    static highlight = false;
   
    constructor(x, y, dna, father = null){
        super(x, y, dna, father); // referencing the parent class constructor
        // variable to count when a carnivore will be able to reproduce
        this.count_for_reproduction = 0;

        Carnivores.carnivores.push(this);
    }
    
    reproduce(){
        this.times_reproduced++;

        var dna_son = this._reproduce();
        var son= new Carnivores(
            this.position.x, this.position.y, dna_son, this
        );

        this.sons.push(son);
        
        return son;
    }
    reproduceSex(partner){
        this.times_reproduced++;

        var dna_son = this.combinaDnas(partner);
        var son = new Carnivores(
            this.position.x, this.position.y, dna_son, this
        )

        this.sons.push(son);

        return son;
    }
    dies(){
        if(this.popover_id) deletePopover(this.popover_id, this.id);
        Carnivores.carnivores = super.remove(Carnivores.carnivores, this);
        Organisms.organisms = super.remove(Organisms.organisms, this);
    }
    searchHerbivore(qtree, visaoC){
        this.status = "looking for prey";
        this.eating = false;
        // Var record: what is the shortest distance (record) from a herbivore so far
        var record = Infinity; // Initially, we will set this distance to be infinite
        var i_more_closer = -1; //
        //What is the index of the closest herbivore in the list of herbivores so far?
        let nearby_herbivores = qtree.searcherbivores(visaoC); 
        for(var i = nearby_herbivores.length - 1; i >= 0; i--){
            var d2 = Math.pow(this.position.x - nearby_herbivores[i].position.x, 2) + Math.pow(this.position.y - nearby_herbivore[i].position.y, 2);
            
            if (d2 <= record){ 
                record = d2;
                i_more_closer = i;
            }
            
        }
        // at which point he will eat
        if(record <= Math.pow(this.initial_detection, 2)){
            this.eating = true;
            this.wandering = false;
            this.status = "hunting"

            nearby_herbivores[i_more_closer].running_away = true;
            nearby_herbivores[i_more_closer].eating = false;
            nearby_herbivores[i_more_closer].wandering = false;
            nearby_herbivores[i_more_closer].status = "running_away";

            if(record <= 25){ 
                this.comeHerbivores(nearby_herbivores[i_more_closer]);
            } else if(nearby_herbivores.length != 0){
                this.chases(nearby_herbivores[i_more_closer]);
            }
        }
    }
    comeHerbivores(herbivores){
        this.qdade_food++;
        if(this.energy_max - this.energy >= herbivores.energy_max * 0.1){
            this.energy += herbivores.energy_max * 0.1; 
        } else{
            this.energy = this.energy_max; 
        }
        if(this.energy > this.energy_max){
            this.energy = this.energy_max;
        }
        herbivores.dies() 
        this.increasesSize();
    }
    display(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.ray, 0, Math.PI * 2);

        if(Herbivores.highlight) {
            c.fillStyle = "rgba(" + this.color2.substr(5).replace(")","") + ",0.15)";
            c.strokeStyle = "rgba(" + this.color.substr(4).replace(")","") + ",0.15)";
        } else {
            c.fillStyle = this.color2;
            c.strokeStyle = this.color;
        }
        c.lineWidth = 5;
        c.stroke();
        c.fill();
}
}