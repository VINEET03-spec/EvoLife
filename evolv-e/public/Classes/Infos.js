class Infos {
    constructor(){
        this.population = [];
        this.speed = [];
        this.agility = [];
        this.ray = [];
        this.detection = [];
        this.energy = [];
        this.spent = [];
        this.average_litter_size = [];
    }

    clear() {
        this.population.length = 0;
        this.speed.length = 0;
        this.agility.length = 0;
        this.ray.length = 0;
        this.detection.length = 0;
        this.energy.length = 0;
        this.spent.length = 0;
        this.average_litter_size.length = 0;
    }
}