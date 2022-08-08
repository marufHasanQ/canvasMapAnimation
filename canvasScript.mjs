
import {mapPath} from './mapPath.mjs'

function canvasFunction() {

    console.log('olo');

    const canvas = document.getElementById("tutorial");
    const context = canvas.getContext("2d");
    context.globalAlpha = 0.5;

    let particlesArray = [];
    let color = '';
    let pause = false;
    let animationArea = innerWidth/8;

    let rotationSpeed = 0.01;
    let frameCount = 0;

    const origin= {
        x: innerWidth / 2,
        y: innerHeight / 2,
    };


    generateParticles(240);

    setSize();
    drawMap(mapPath);
    anim();

    addEventListener(
        "keyup",
        (e) => {
            if(e.key === 'ArrowLeft')
                rotationSpeed -= 1;
            if(e.key === 'ArrowRight')
                rotationSpeed += 1;
            if(e.key === 'ArrowUp')
                rotationSpeed += .01;
            if(e.key === 'ArrowDown')
                rotationSpeed -= .01;
            if( e.key === ' ')
                pause = !pause;
            console.log(rotationSpeed);
        },
        { passive: false }
    );

    addEventListener("resize", () => setSize());

    function generateParticles(amount) {
        for (let i = 0; i < amount; i++) {
            particlesArray[i] = new Particle(
                innerWidth / 2,
                innerHeight/ 2,
                4,
                generateColor(),
                (animationArea)/Math.floor(Math.random()*6),
                rotationSpeed
                //i%2===0? rotationSpeed:(-1*rotationSpeed)
            );
        }
    }

    function generateColor() {
        let hexSet = "0123456789ABCDEF";
        let finalHexString = "#";
        for (let i = 0; i < 6; i++) {
            finalHexString += hexSet[Math.ceil(Math.random() * 15)];
        }
        return finalHexString;
    }

    function setSize() {
        canvas.height = innerHeight;
        canvas.width = innerWidth;
    }

    function Particle(x, y, particleTrailWidth, strokeColor,t, rotateSpeed) {
        this.x = x;
        this.y = y;
        this.particleTrailWidth = particleTrailWidth;
        this.strokeColor = strokeColor;
        this.theta = Math.random() * Math.PI * 2;
        //this.rotateSpeed = rotateSpeed;
        this.t = t ;

        this.rotate = () => {
            const ls = {
                x: this.x,
                y: this.y,
            };

            this.theta = (this.theta + rotationSpeed) ;
            this.t += 1;


            this.x = origin.x + Math.cos(this.theta) * this.t;
            this.y = origin.y + Math.sin(this.theta) * this.t;
            context.beginPath();
            context.lineWidth = this.particleTrailWidth;
            context.strokeStyle = this.strokeColor;
            context.moveTo(ls.x, ls.y);
            context.lineTo(this.x, this.y);
            context.stroke();

        };
    }
    function drawMap(mapPath) {

        context.save();
        context.strokeStyle = 'rgba(255,0,0,0)';
        //context.translate(-243+ innerWidth/2,-258+innerHeight/2);

        context.translate(innerWidth/2,innerHeight/2 );
        context.scale(3.5,3.5);
        /*
        const ellipse = new Path2D();
        //ellipse.ellipse(150, 75, 40, 60, Math.PI * .25, 0, 2 * Math.PI);
        ellipse.ellipse(0, 0, 40, 60, Math.PI * .25, 0, 2 * Math.PI);
        context.lineWidth = 25;
        context.strokeStyle = 'red';
        context.fill(ellipse);
        context.stroke(ellipse);
        context.fillStyle = 'red';
        let p = new Path2D('M10 10 h 80 v 80 h -80 Z');
        context.fill(p);
        */
        context.lineWidth = 1;
        context.stroke(mapPath);

        context.restore();
    }

    function anim() {
        requestAnimationFrame(anim);

        frameCount += 1;
        //skip every other animation. only animate when frameCount is even. to reduce load on cpu.
        if(pause || frameCount % 2 === 0
        ){

            if(frameCount > 50)
                frameCount = 0;

            return;
        }
        //clear with black entire screen every time a frame is drawn, keep it semi-transparent for blur effect.
        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        if(new Date().getSeconds() % 4 === 0){

            color = generateColor();

        }


        particlesArray.forEach((particle) =>{

            //if the particle is out of animation area
            const outOfBoundParticle = particle.t > animationArea? particle : false; 

            if(outOfBoundParticle){
                // the particle is out of animation area, return it to the center
                outOfBoundParticle.x = origin.x;
                outOfBoundParticle.y = origin.y;
                outOfBoundParticle.strokeColor = 'red';
                outOfBoundParticle.t = 2;
            }

            context.save();
            //make same translation and scale  that is used in drawing the map to check if particle is in map 
            context.translate(innerWidth/2,innerHeight/2 );

            context.scale(3.5,3.5);
            context.lineWidth = 2;
            /*
            if(context.isPointInStroke(mapPath, particle.x,particle.y)){

                context.strokeStyle= 'yellow';
                context.beginPath()
                context.moveTo(particle.x,particle.y)
                context.lineTo(particle.x +1 ,particle.y + 1 )
                context.stroke();

            }
            */
            if(context.isPointInPath(mapPath,particle.x,particle.y)){

                particle.strokeColor = 'red';

            }
            else{

                particle.strokeColor = 'green';
            }
            context.restore();
            particle.rotate();
        })
    }

}

export {canvasFunction};
