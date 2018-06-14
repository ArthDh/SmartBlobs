// Using genetic algorithm

var timesteps = 300; //try 150
var count = 0;
var gen =1;
var population;
var pop_size =20;  //try 50
var target;
var maxfit =0;
var prev_maxfit=0;
var obstacles =[];
var rx = 150;
var ry=150;
var rw = 300;
var rh =10;
var min_reached_at =300;

var max_error =10;
var magnitude =0.2; //Try 0.7
var m_rate = 0.01;
var errorSlider, magnitudeSlider, mutationSlider,slider;
var mouseError = 20;
var multiplier =1;
var prev_slider_value = 1;
// TODO: Add more obstacles
var n_obstacles=5;

function setup() {
    createCanvas(600,400);
    population = new Population(pop_size);
    target = createVector(width/2, 25);
    for (var i = 0; i < n_obstacles; i++) {
        // Check for overlapping
        let rx = random(50,300);
        let ry = random(50,300);
        let rw = random(100,250);
        let rh = random(10,15);
        obstacles.push(new Obstacle(rx,ry,rw,rh));
    }

    slider = createSlider(1, 100, 1);
    slider.position(20, height+80);
    // magnitudeSlider = createSlider(0, 1,magnitude, 0.05);
    // magnitudeSlider.position(20, height-60);
    // mutationSlider = createSlider(0, 1, m_rate, 0.05);
    // mutationSlider.position(20, height-40);
}



function draw(){


    // console.log(dist(mouseX,mouseY, target.x,target.y));


    // text("Magnitude ", magnitudeSlider.x * 2 + magnitudeSlider.width, height-50);
    // text("Mutation percentage", mutationSlider.x * 2 + mutationSlider.width, height-30);
    // magnitude = magnitudeSlider.value();
    // // console.log(magnitude);
    // m_rate = mutationSlider.value();
    // max_error = errorSlider.value();
    for(var c=0;c<prev_slider_value;c++)
    {
      population.update();
      if(count==timesteps){
      maxfit = population.evaluate();
      population.norm();
      // console.log(maxfit, prev_maxfit);
      if(maxfit==1){
              // Pure breeds ?
              population.selection(0);
          }else{
          if(maxfit==prev_maxfit&&maxfit<0.8){

              population.selection(m_rate);
              if(m_rate<=0.02){
              m_rate+= 0.005;
              }
          }else{
              population.selection(m_rate);
              prev_maxfit = maxfit;
          }
      }
      gen +=1;
      count = 0;
      prev_slider_value = slider.value();
      }
      count++;
    }


    background(150);
    fill(0);
    noStroke();
    // rect(obstacle[0][0],obstacle[0][1],obstacle[0][2],obstacle[0][3]);
    // rect(rx,ry,rw,rh);
    ellipse(target.x, target.y, 25);
    for (var i = 0; i < n_obstacles; i++) {
        obstacles[i].show();
    }
    population.show();
    noStroke();
    fill(0);
    text("Timesteps: "+count, 10, 20);
    text("Generation: "+gen, 10,40);
    text("Max Fitness: "+maxfit, 10,60);
    text("Time multiplier: "+slider.value()+"x",10,80);


}

class Blob{
    constructor(child_genes){
    this.pos = createVector(width/2, height-10);
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
    this.dna = new DNA(timesteps,magnitude);
    }
    this.d = 0;
    this.crashed = false;
    this.reached_target_at = 0;
    }

    applyForce(force)
    {
        this.acc.add(force);
    }

    update()
    {

        if(dist(this.pos.x,this.pos.y, target.x,target.y)<max_error)
        {
            this.reached_target = true;
        }

        for (var i = 0; i <n_obstacles ; i++)
        {
          if(getObs(i).blobCrashed(this)){
            this.crashed = true;
            this.pos.x = this.pos.x;
            this.pos.y = this.pos.y;
            }
        }
        if(this.pos.x<0 ||this.pos.x>width ||this.pos.y<0 ||this.pos.y>height)
        {
            this.pos.x = this.pos.x;
            this.pos.y = this.pos.y;
            this.crashed = true;
        }
        // Changed:  || this.crashed ==true
        if(this.reached_target)
        {
            this.pos.x = target.x;
            this.pos.y = target.y;
        }
        if(!this.reached_target && !this.crashed){
        this.applyForce(this.dna.genes[count]);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.reached_target_at += 1;
        }

    }

    show()
    {
        if(this.reached_target){
            // console.log("occured");
            push();
            translate(this.pos.x,this.pos.y);
            rotate(this.vel.heading());
            noStroke();
            fill(this.color[0],this.color[1],this.color[2],100);
            ellipse(0,0,this.size);
            pop();
        }
        if(this.crashed){
            min_reached_at = 300;
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
         this.fitness = 10*(1/(this.d**2));
         if(this.reached_target){
            this.fitness =1;
         }
         else if(this.reached_target_at!=timesteps){
            this.fitness += 3*((1/this.d)/(this.reached_target_at));
         }

         if(this.reached_target_at<min_reached_at){
            min_reached_at = this.reached_target_at;
            this.fitness = 1;
         }

         // if(dist(this.pos.x,this.pos.y, mouseX,mouseY)< 10){
         //    // this.fitness =1;
         //    console.log("Occured");
         // }

         if(this.crashed){
            this.fitness =0.000000001;
         }

        return this.fitness;
    }
    //  this.fitness = 1/ Math.exp(this.d);
        //  if(this.reached_target && this.reached_target_at < min_reached_at)
        //  {
        //     // console.log("reached_target_at :"+this.reached_target_at);
        //     this.fitness *= 1.25;
        //     min_reached_at = this.reached_target_at;
        //  }
        //  if (this.pos.x<0 ||this.pos.x>width ||this.pos.y<0 ||this.pos.y>height ||this.crashed ==true){
        //     this.fitness -=0.75;
        // }

        // if(this.fitness<0)
        // {
        //     this.fitness = 0;
        // }


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
            // console.log("error occured");
        }
        // console.log(child_color);
        return([new_genes, child_color]);

    }

    mutate(rate){
        if(rate==0){
            // console.log("Occured");

        }else{
                for (var i =0;i<this.dna.genes.length;i++) {
            if (random(1)<rate){
            this.dna.genes[i] = p5.Vector.random2D();
            this.dna.genes[i].setMag(magnitude);
            this.color = [this.color[0],this.color[1],random(255)];
            }
        }
        }


    }

    // clicked(){
    //     this.fitness = 1;
    //     console.log("Occured");
    // }

}

// Enabled helping blobs using mouse
function mousePressed() {
    // for(var i =0;i<pop_size;i++){
    //     if(dist(population.getel(i).pos.x,population.getel(i).pos.y, mouseX,mouseY)< mouseError)
    //     {
    //         population.getel(i).clicked();
    //     }
    // }
    if(mouseX>0 &&mouseX<width && mouseY<height && mouseY>0){
        target.x = mouseX;
        target.y = mouseY;
        maxfit =0;
        gen =1;
        prev_maxfit=0;

    }
}
function getObs(i){
    return obstacles[i];
}
// Doesnt Work -(?)
// function createObstacles(n_obstacles){
//     obs = [];
//     for (var i = 0; i < n_obstacles; i++) {
//         let rx = random(0,150);
//         let ry = random(0,150);
//         let rw = random(100,200);
//         let rh = random(5,10);
//         obs.push(new Obstacle(rx,ry,rw,rh));
//     }
// }
