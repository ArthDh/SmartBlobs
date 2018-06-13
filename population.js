
class Population{
    constructor(size){
        this.maxfit = 0;
        this.size =size;
        this.blobs_pop=[];
        this.sum_exp =0;
        for (var i = 0; i < this.size; i++) {
            this.blobs_pop[i] = new Blob();
        }
    }
    run(){
        for(var i =0 ; i< this.size; i++){
            this.blobs_pop[i].update();
            this.blobs_pop[i].show();
        }
    }
    evaluate(){
        this.maxfit =0;
        for(var i =0 ; i< this.size; i++){
            var fit = this.blobs_pop[i].get_fitness();
            if(fit>this.maxfit)
            {
                this.maxfit =fit;
            }
        }
        return(this.maxfit);
        }

    norm(){
        // this.sum_exp=0;
        // for (var i = 0;i<this.size;i++) {
        //      this.sum_exp += Math.exp(-this.blobs_pop[i].fitness)
        // }
        for (var i = 0;i<this.size;i++) {
            this.blobs_pop[i].fitness  /= this.maxfit;
            // this.blobs_pop[i].fitness = map(this.blobs_pop[i].fitness,0,1,0,10);
            // createP(this.blobs_pop[i].fitness);
        }
        // for (var i = 0;i<this.size;i++) {
        //      this.blobs_pop[i].fitness = Math.exp(-this.blobs_pop[i].fitness)/this.sum_exp;
        // }
    }

    getel(i){
        return this.blobs_pop[i];

    }
    selection(m_rate){
        var new_pop =[];

        for (var i=0;i<this.size;i++)
        {
            var parentA = random(this.blobs_pop);
            var parentB = random(this.blobs_pop);
            while(true){

                if(random(1)<parentA.fitness && random(1)< parentB.fitness){
                    var child_genes = parentA.crossover(parentB);
                    var child = new Blob();
                    child.dna.genes = child_genes[0];
                    child.color = child_genes[1];
                    child.mutate(m_rate);
                    new_pop.push(child);
                    break;
                }else{
                  parentA = random(this.blobs_pop);
                  parentB = random(this.blobs_pop);
                }
            }

        }
        // console.log(new_pop);
        this.blobs_pop = new_pop;
    }
}

