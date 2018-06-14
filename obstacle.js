class Obstacle{
    constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color =[random(255),random(255),random(255)];
    }

    show()
    {
        fill(this.color);
        noStroke();
        // rect(obstacle[0][0],obstacle[0][1],obstacle[0][2],obstacle[0][3]);
        rect(this.x,this.y,this.w,this.h);
    }

    blobCrashed(blob){
        return(blob.pos.x>this.x-blob.size/2 && blob.pos.x<this.x+this.w+blob.size/2 && blob.pos.y>this.y-blob.size/2 && blob.pos.y<this.y+this.h+blob.size/2);
    }


}
