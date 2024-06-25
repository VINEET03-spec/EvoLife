class Herbivores extends Organisms{
    static herbivores = [];
    static highlight = false;
    
    constructor(x, y, dna, parent = null){
        super(x, y, dna, parent);
        this.count_for_reproduction = 0;

        Herbivores.herbivores.push(this);
    }
    reproduce(){
        this.times_reproduced++;

        var dna_son = this._reproduce();
        var son = new Herbivores(
            this.position.x, this.position.y, dna_son, this
        );
        
        this.sons.push(son);

        return son;
    }
    reproduceSexual(partner){
        this.times_reproduced++;

        var dna_son = this.combinaDnas(partner);
        var son = new Herbivores(
            this.position.x, this.position.y, dna_son, this
        )
        this.sons.push(son);
        return son;
    }

    dies(){
        if(this.popover_id) deletePopover(this.popover_id, this.id);
        Herbivores.herbivores = super.remove(Herbivores.herbivores, this);
        Organisms.organisms = super.remove(Organisms.organisms, this)
    }
    searchFood(qtree, visaoH){
        this.status = "looking for food";
        this.eating = false;
        var record = Infinity; 
        var i_more_closer= -1; 
        let next_foods = qtree.searchfoods(visaoH); 
        for(var i = next_foods.length - 1; i >= 0 ; i--){
            var d2 = Math.pow(this.position.x - next_foods[i].position.x, 2) + Math.pow(this.position.y - next_foods[i].position.y, 2);
            if (d2 <= record){ 
                record = d2; 
                i_more_closer= i;
            }
        }
        if(record <= Math.pow(this.initial_detection, 2)){
            this.eating = true;
            this.wandering = false;
            this.status = "catching food";
            
            if(record <= 25){
                let static_list_index = 0;
                Food.foods.every(a => {
                    if(a.checkId(next_foods[i_more_closer].id)){
                        return false;
                    }
                    static_list_index++;

                    return true;
                });

                this.comeFood(next_foods[i_more_closer], static_list_index);
                
            } else if(next_foods.length != 0){
                this.chases(next_foods[i_more_closer]);
            }
        }
    }

    comeFood(food, i){
        this.qdade_food++;
        if(this.energy_max - this.energy >= food.energy_food * 0.1){
            this.energy += food.energy_food * 0.1;
        } else{ 
            this.energy = this.energy_max;
        }
        if(this.energy > this.energy_max){
            this.energy = this.energy_max;
        }
        Food.foods.splice(i, 1); 
        this.increasesSize();
    }
    detectPredator(qtree, visaoH){
        this.running_away = false;
        var record = Infinity; 
        var i_more_closer= -1; 
        let carnivores_proximos = qtree.searchcarnivores(visaoH); 
        for(var i = carnivores_proximos.length - 1; i >= 0; i--){
            var d2 = Math.pow(this.position.x - carnivores_proximos[i].position.x, 2) + Math.pow(this.position.y - carnivores_proximos[i].position.y, 2);
            if (d2 <= record){ 
                record = d2; 
                i_more_closer= i; 
            }
        }
            if(record <= Math.pow(this.initial_detection, 2)){
            
            if(carnivores_proximos.length != 0){
                this.run_away(carnivores_proximos[i_more_closer]); 
            }
        }
        
    }
    run_away(target){
        var desired_speed = target.position.subNew(this.position); 
        desired_speed.x = -desired_speed.x; 
        desired_speed.y = -desired_speed.y 
        desired_speed.setMag(this.speed_max);
        var redirection = desired_speed.subNew(this.speed);
        redirection.limit(this.force_max); 
        this.applystrength(redirection);
    }

    display(){
        c.beginPath();
        c.ellipse(this.position.x, this.position.y, this.ray * 0.7, this.ray * 1.1, this.speed.headingRads() - Math.PI/2, 0, Math.PI * 2);
        if(Carnivores.highlight) {
            c.fillStyle = "rgba(" + this.color.substr(4).replace(")","") + ",0.15)";
            c.strokeStyle = "rgba(" + this.color.substr(4).replace(")","") + ",0.15)";
        } else {
            c.fillStyle = this.color;
            c.strokeStyle = this.color;
        }

        c.fill();
    }
}
