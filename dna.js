class DNA{
    constructor(timestep){
        this.genes=[];
        for (var i = 0; i <timestep; i++) {
            this.genes[i] = p5.Vector.random2D();
            this.genes[i].setMag(0.2);
        }
    }
}

