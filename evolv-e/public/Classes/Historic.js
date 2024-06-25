class Historic {
    constructor() {
        this.herbivores = new Infos();
        this.carnivores = new Infos();
        this.seconds = [];
        this.food_rate = []; 
    }

    clear() {
        this.herbivores.clear();
        this.carnivores.clear();
        this.seconds.length = 0;
    }
}