class Organisms{
    static organisms = [];
    static n_total_organisms = 0;
    static id = 0;

    constructor(x, y, dna, father = null){
        this.id = Organisms.id++;        
        this.position = new Vector(x, y);
        if(father){
            this.father = father;
        }
        this.children= [];
        this.initial_radius = dna.initial_radius;
        this.speed_max = dna.speed_max;
        this.force_max = dna.force_max;
        this.color = dna.color;
        this.initial_detection_radius = dna.initial_detection_radius;
        this.litter_range = dna.litter_range;
        this.sex = dna.sex;


        // DNA -> Object to separate only attributes passed to descendants
        this.dna = new DNA(
            this.initial_radius,
            this.speed_max,
            this.force_max,
            this.color,
            this.initial_detection_radius,
            this.litter_range,
            this.sex
        )

        this.ray = this.initial_radius;
        this.speed = new Vector(0.0001, 0.0001);
        this.acel = new Vector(0, 0);
        var rgb = this.color.substring(4, this.color.length - 1).split(",");
        this.color2 = "rgba(" + Math.floor(parseInt(rgb[0]) * 0.4) + "," + Math.floor(parseInt(rgb[1]) * 0.4) + "," + Math.floor(parseInt(rgb[2]) * 0.4) + ")";
        
        this.initial_detection = this.initial_detection_radius;
        this.energy_max = Math.pow(this.ray, 2) * 6;
        this.energy_max_fix = Math.pow(this.initial_radius * 1.5, 2) * 6; //Used to obtain non-variable values ​​in the graph


        // this.energy = this.energy_max * 0.75
        if(father){
            this.energy = (this.energy_max * (0.75 + Math.random() / 4)) / (father.litter_size) * 0.6;
        } else{
            this.energy = this.energy_max * 0.75;
        }

        this.energy_spend_rate;
        this.minimum_spend = 0.0032 * Math.pow(Math.pow(this.ray, 2), 0.75); 
        this.energy_spend_rate_max = this.minimum_spend + (Math.pow(this.initial_radius * 1.5, 2) * Math.pow(this.speed_max, 2)) * 0.00012;;
        this.chance_of_reproduction = 0.5;
        this.status;
        this.qdade_food = 0;
        this.times_reproduced = 0;
        this.second_birth = total_seconds; 
        this.life_time = parseInt(generatesNumeroPorInterval(200, 300));
        this.time_lived = 0;
        this.litter_size;

    
        this.eating = false;
        this.running_away = false;
        this.wandering = false;
        this.d = 20; 
        this.d_circle = 2;
        this.ray_circle = 1;
        this.angulo_vagueio = Math.random() * 360;
        this.before_the_division = false;
        this.position_fixa_momentanea = new Vector(x, y);

        Organisms.organisms.push(this);
        Organisms.n_total_organisms++;
    }
  
    _reproduce(){
        return this.dna.mutate();
    }
    update(){
        this.time_lived = total_seconds - this.second_birth;
        this.energy_spend_rate = (Math.pow(this.ray, 2) * Math.pow(this.speed.mag(), 2)) * 0.0002; 
        if(this.energy > 0){
            this.energy -= (this.energy_spend_rate + this.minimum_spend);
            if(Math.random() < (0.0005 * this.qdade_food)/10){ 
                if(Math.random() <= this.chance_of_reproduction){
                    this.litter_size = generatesInteger(this.litter_range[0], this.litter_range[1] + 1);
                    for(var i = 0; i < this.litter_size; i++){
                        if(Math.random() < 0.2){ 
                            this.reproduce();
                        }
                    }
                }
            }
        } else{
            this.dies(); 
        }
        
        if(this.time_lived >= this.life_time){ 
            this.dies();
        }
        if(split_screen){
            this.createsBorders(true);
        } else{
            this.createsBorders(false);
        }
        this.speed.add(this.acel);
        this.speed.limit(this.speed_max);
        if(this.proxy) {
            this.proxy.add(this.speed)
        } else {
            this.position.add(this.speed);
        }
        this.acel.mul(0);
        this.display();
    }

    increasesSize(){
        if(this.ray<(this.initial_radius*1.5)){
            this.ray += 0.05*this.ray;
            this.initial_detection+= 0.03*this.initial_detection;
        }
        this.energy_max = Math.pow(this.ray, 2) * 6
    }
    createsBorders(split_screen){ // split_screen: boolean
        this.delimitBorders(split_screen);
        this.avoidEdges(split_screen);
    }
    delimitBorders(split_screen){
        if(split_screen == true){
            if(this.position.x <= universeWidth/2){
                if(this.position.x + 2*this.ray > universeWidth / 2)
                    this.speed.x = this.speed.x * -1; 

                if(this.position.x < 0) 
                    this.speed.x = this.speed.x * -1;

                if(this.position.y + this.ray > universeHeight) 
                    this.speed.y = this.speed.y* -1;

                if(this.position.y < 0)
                    this.speed.y = this.speed.y * -1;
            } else{
                if(this.position.x + 2*this.ray > universeWidth)
                    this.speed.x = this.speed.x * -1; 

                if(this.position.x - this.ray < universeWidth / 2) 
                    this.speed.x = this.speed.x * -1;

                if(this.position.y + this.ray > universeHeight) 
                    this.speed.y = this.speed.y* -1;

                if(this.position.y < 0) 
                    this.speed.y = this.speed.y * -1;
            }
            
        } else{
            if(this.position.x + 2*this.ray > universeWidth) 
                this.speed.x = this.speed.x * -1;

            if(this.position.x - this.ray < 0) 
                this.speed.x = this.speed.x * -1;

            if(this.position.y + this.ray > universeHeight)
                this.speed.y = this.speed.y* -1;

            if(this.position.y < 0) 
                this.speed.y = this.speed.y * -1;
        }
        
    }
    avoidEdges(split_screen){
        var desired_speed = null; 
        this.close_to_the_edge = false;

        if(split_screen == true){
            if(this.position.x <= universeWidth/2){
                if(this.position.x - this.ray < this.d){
                    desired_speed = new Vector(this.speed_max, this.speed.y); 
                    this.close_to_the_edge = true;
                } 
                else if(this.position.x + 2*this.ray > universeWidth / 2 - this.d){ 
                    desired_speed = new Vector(-this.speed_max, this.speed.y); 
                    this.close_to_the_edge = true;
                if(this.position.y - this.ray < this.d){
                    desired_speed = new Vector(this.speed.x, this.speed_max);
                    this.close_to_the_edge = true;
                }
                else if(this.position.y + this.ray > universeHeight - this.d){
                    desired_speed = new Vector(this.speed.x, -this.speed_max); 
                    this.close_to_the_edge = true;
                }
            }
            else{
                if(this.position.x - this.ray < universeWidth/2 + this.d){
                    desired_speed = new Vector(this.speed_max, this.speed.y); 
                    this.close_to_the_edge = true;
                } 
                else if(this.position.x + 2*this.ray > universeWidth - this.d){
                    desired_speed = new Vector(-this.speed_max, this.speed.y); 
                    this.close_to_the_edge = true;
                }
                if(this.position.y < this.d){
                    desired_speed = new Vector(this.speed.x, this.speed_max); 
                    this.close_to_the_edge = true;
                }
                else if(this.position.y > universeHeight - this.d){
                    desired_speed = new Vector(this.speed.x, -this.speed_max); 
                    this.close_to_the_edge = true;
                }
            }
            
        } else{ 
             if(this.position.x - this.ray < this.d){ 
                desired_speed = new Vector(this.speed_max, this.speed.y); 
                this.close_to_the_edge = true;
            } 
            else if(this.position.x + this.ray > universeWidth - this.d){
                desired_speed = new Vector(-this.speed_max, this.speed.y);
                this.close_to_the_edge = true;
            }
            if(this.position.y - this.ray < this.d){
                desired_speed = new Vector(this.speed.x, this.speed_max); 
                this.close_to_the_edge = true;
            }
            else if(this.position.y + this.ray> universeHeight - this.d){
                desired_speed = new Vector(this.speed.x, -this.speed_max);
                this.close_to_the_edge = true;
            }
        }
        
    }
        if(desired_speed != null){
            desired_speed.normalize(); 
            desired_speed.mul(this.speed_max); 
            var redirection = desired_speed.sub(this.speed); 
            redirection.limit(this.force_max * 100); 
            this.applystrength(redirection); 
        }
    }
    applystrength(strength){
        this.acel.add(strength);
    }

    behavior(good, bad){
        
    }
    wanders(){
            this.wandering = true;
            this.status = "wandering";
            var center_circle = new Vector(0, 0); 
            center_circle = this.speed.copy(); 
            center_circle.normalize();
            center_circle.mul(this.d_circle); 
            var displacement = new Vector(0, -1);
            displacement.mul(this.ray_circle); 
            displacement.rotateDegs(this.angulo_vagueio); 
            this.angulo_vagueio += Math.random() * 30 - 15; 
            var strength_vagueio = new Vector(0, 0);
            strength_vagueio = center_circle.add(displacement);
            
            if(this.eating || this.running_away){
                strength_vagueio.mul(0.03);
            }
            this.applystrength(strength_vagueio.mul(0.2));
        }
    

    chases(target){
        target.running_away = true;
        var desired_speed = target.position.subNew(this.position);
        desired_speed.setMag(this.speed_max);
        var redirection = desired_speed.subNew(this.speed);
        redirection.limit(this.force_max); 
        this.applystrength(redirection);
    }
    searchPartners(){

    }
    approximateOfPartner(){
    }
    combinaDnas(partner){
        var dnaSon = [];

        // ray initial
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.initial_radius)
        } else{
            dnaSon.push(partner.dna.initial_radius)
        }

        if(Math.random() < 0.5){
            dnaSon.push(this.dna.speed_max)
        } else{
            dnaSon.push(partner.dna.speed_max)
        }
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.force_max)
        } else{
            dnaSon.push(partner.dna.force_max)
        }
        // color
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.color)
        } else{
            dnaSon.push(partner.dna.color)
        }
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.initial_detection_radius)
        } else{
            dnaSon.push(partner.dna.initial_detection_radius)
        }
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.litter_range)
        } else{
            dnaSon.push(partner.dna.litter_range)
        }

        // sex
        if(Math.random() < 0.5){
            dnaSon.push(this.dna.sex)
        } else{
            dnaSon.push(partner.dna.sex)
        }

        var dna_Son = new DNA(dnaSon[0], dnaSon[1], dnaSon[2], dnaSon[3], 
            dnaSon[4], dnaSon[5], dnaSon[6])
        
        return dna_Son;
    }

    is_dead(){
        return this.energy <= 0;
    }
    
    remove(list) {
        var what, a = arguments, L = a.length, indice;
        while (L > 1 && list.length) {
            what = a[--L];
            while ((indice = list.indexOf(what)) !== -1) {
                list.splice(indice, 1);
            }
        }
        return list;
    }

    checkId(id){
        return (id == this.id);
    }
    
}