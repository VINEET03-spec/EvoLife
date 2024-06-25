class DNA{
    constructor(initial_radius, speed_max, force_max, color, initial_detection_radius,litter_range, sex){
        this.initial_radius = initial_radius;
        this.speed_max = speed_max;
        this.force_max= force_max;
;
        this.color = color;
        this.initial_detection_radius = initial_detection_radius;
        this.litter_range =litter_range;
        this.sex = sex; 
    }

    
mutate(){//Helper function for mutation with some mutation logic
        var mutated_dna;

        var initial_radius_son = newmutation(this.initial_radius);
        if(initial_radius_son < 0){
            initial_radius_son = 0;
        }
  
        var speed_max_son = newmutation(this.speed_max);
        if(speed_max_son < 0){
            speed_max_son = 0;
        }

    
        var force_max_son = newmutation(this.force_max);


        var color_son = colorMutation(this.color);

        var initial_detection_radius_son = newmutation(this.initial_detection_radius);
        if(initial_detection_radius_son < initial_radius_son){
            initial_detection_radius_son = initial_radius_son;
        }

        var litter_range_son = MutationNinhada(this.litter_range[0], this.litter_range[1]);

        mutated_dna = new DNA(
            initial_radius_son, 
            speed_max_son,
            force_max_son,
            color_son,
            initial_detection_radius_son,
           litter_range_son
            )

        return mutated_dna;
    }

}