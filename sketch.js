// Using genetic algorithm


var timesteps = 300;
var count = 0;
var gen =1;
var population;
var pop_size = 100;
var target;
var maxfit =0;
var obstacle =[];
var rx = 150;
var ry=150;
var rw = 300;
var rh =10;

// TODO: Add more obstacles

function setup() {
    createCanvas(600,400);
    population = new Population(pop_size);
    target = createVector(width/2, 25);
    obstacle.push([rx,ry,rw,rh]);



}

function draw(){
    background(150);
    fill(0);
    noStroke();
    // rect(obstacle[0][0],obstacle[0][1],obstacle[0][2],obstacle[0][3]);
    rect(rx,ry,rw,rh);
    ellipse(target.x, target.y, 25);
    count++;

    noStroke();
    fill(0);
    text("Timesteps: "+count, 10, 20);
    text("Generation: "+gen, 10,40);
    text("Max Fitness: "+maxfit, 10,60);

    population.run();
    // perReachedP.html("Percentage completed: "+(perReached/pop_size)*100+"%");
    if(count==timesteps){

    maxfit = population.evaluate();

    population.norm();
    population.selection();
    gen +=1;
    count = 0;
    perReached =0;
    }
}

class Blob{
    constructor(child_genes){
//         if(child_genes){    console.log(child_genes[0]);
// }
    this.pos = createVector(width/2, height);
    this.vel = createVector(0,-1);
    this.acc = createVector();
    if(child_genes){
    this.color = [child_genes[1][0],child_genes[1][0],child_genes[1][0]];
    }else{
    this.color =[random(255),random(255),random(255)];
    }
    this.fitness = 0;
    this.reached_target =false;
    this.size = random(5,25);
    if(child_genes){
        this.dna.genes = child_genes[0];
    }else{
    this.dna = new DNA(timesteps);
    }
    this.d = 0;
    this.crashed = false;
    }

    applyForce(force)
    {
        this.acc.add(force);
    }

    update()
    {
        if(Math.abs(this.pos.x-target.x)<10 && Math.abs(this.pos.y-target.y)<10)
        {
            this.reached_target = true;
        }

        // for (var i =0;i<obstacle.length;i++) {
        //     if(this.pos.x+this.size>obstacle[i][0] && this.pos.x<obstacle[i][2]+obstacle[i][0] +this.size&& this.pos.y>obstacle[i][1]+this.size && this.pos.y<obstacle[i][3]+obstacle[i][1] +this.size)
        //     {
        //         this.crashed = true;
        //     }
        // }
        if(this.pos.x>rx && this.pos.x<rx+rw && this.pos.y>ry && this.pos.y<ry+rh)
        {
            this.crashed = true;
        }
        if (this.pos.x<0 ||this.pos.x>width ||this.pos.y<0 ||this.pos.y>height || this.crashed ==true ){
            this.pos.x = this.pos.x;
            this.pos.y = this.pos.y;
        }
        if(this.reached_target)
        {
            this.pos.x = target.x;
            this.pos.y = target.y;
            // console.log("Occured");
        }
        if(!this.reached_target && !this.crashed){
        this.applyForce(this.dna.genes[count]);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        }
    }

    show()
    {
        if(this.reached_target){
            push();
            translate(this.pos.x,this.pos.y);
            rotate(this.vel.heading());
            noStroke();
            fill(this.color[0],this.color[1],this.color[2],125);
            ellipse(0,0,this.size);
            pop();

        }
        else{
        push();
        translate(this.pos.x,this.pos.y);
        rotate(this.vel.heading());
        noStroke();
        fill(this.color[0],this.color[1],this.color[2]);
        ellipse(0,0,this.size);
        pop();
        }
    }

    get_fitness()
    {
         this.d = dist(this.pos.x,this.pos.y, target.x,target.y);
        this.fitness = 1/ Math.exp(this.d); //This is the fastest
        // this.fitness = 1/ this.d; //This is the Slowest
        // this.fitness = 1/ this.d**2; //Faster than 1/d

        if (this.pos.x<0 ||this.pos.x>width ||this.pos.y<0 ||this.pos.y>height ||this.crashed ==true){
            this.fitness -=0.5;
        }
        if(this.pos.x-target.x<10 &&this.pos.y-target.y<10)
        {
            this.fitness *= 1.25;
        }
        if(this.fitness<0)
        {
            this.fitness = 0;
        }

        return this.fitness;
    }

    crossover(parentB)
    {
        var new_genes=[];

        if(this.fitness > parentB.fitness)
        {
            var child_color = this.color;
            var dna_length = floor(random(this.dna.genes.length));
            for(var i=0;i<this.dna.genes.length; i++)
            {
                if(i<dna_length)
                {
                    new_genes.push(this.dna.genes[i]);
                }else{
                    new_genes.push(parentB.dna.genes[i]);
                }
            }
        }else{
            var child_color = parentB.color;
            var dna_length = floor(random(parentB.dna.genes.length));
            for(var i=0;i<this.dna.genes.length; i++)
            {
                if(i<dna_length)
                {
                    new_genes.push(parentB.dna.genes[i]);
                }else{
                    new_genes.push(this.dna.genes[i]);
                }
            }
        }
        if (new_genes==undefined){
            new_genes = this.dna.genes;
            console.log("error occured");
        }
        // console.log(child_color);
        return([new_genes, child_color]);

    }

    mutate(rate){

    for (var i =0;i<this.dna.genes.length;i++) {
            if (random(1)<rate){
            this.dna.genes[i] = p5.Vector.random2D();
            this.dna.genes[i].setMag(0.2);
            this.color = [this.color[0],this.color[1],random(255)];
            }
        }
    }
}
