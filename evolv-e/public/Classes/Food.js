class Food{
    static foods = [];
    static id = 0;
    constructor(x, y, ray){
        this.position = new Vector(x, y);
        this.ray = ray;
        this.energy_food = Math.floor(Math.PI * Math.pow(this.ray, 2)) * 15;

        Food.foods.push(this);
        this.id = Food.id++;
    }
    display(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.ray, 0, Math.PI * 2);
        c.fillStyle = "rgb(115, 158, 115)";
        c.fill();
    }
    checaId(id){
        return (id == this.id);
    }
}