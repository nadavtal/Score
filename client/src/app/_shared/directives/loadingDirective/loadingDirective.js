

;(function() {

    'use strict';
  
    /**
     * Auth interceptor
     *
     * @desc intercept every request, response, error etc.
     */
  
    angular
      .module('boilerplate')
      .directive('loadingDirective', loadingDirective);
  
    loadingDirective.$inject = ['$q', '$injector', '$state'];
  
    function loadingDirective($q, $injector, $state) {
        
        return {
            templateUrl: 'app/_shared/directives/loadingDirective/loadingDirective.htm',
            link: function (scope, element, attributes) {
                console.log(scope)
                console.log(attributes);
               
                var canvas = $('#loadingCanvas')[0];
                var ctx = canvas.getContext('2d');
                var w = canvas.width = window.innerWidth;
                var h = canvas.height = window.innerHeight;
                
                var progressCircle = {
                    x: w / 2,
                    y: h / 2,
                    diameter: 160,
                    stroke: 16,
                    color: '',
                    start: Math.PI * 1.5,
                    end: Math.PI * 1.5,
                    percentage: 0,
                    
                    calcPercent: function(percentage) {
                        // Set the max to 100
                        if (percentage > 100) {	percentage = 100; }
                        
                        percentage = percentage / 100;
                        this.percentage = Math.round(percentage * 100);
                        
                        // Set where the arcs should end
                        this.end = this.start + (Math.PI * 2) * percentage;
                        
                        // Gradually shift color from red (0deg) to green (120deg)
                        this.color = 'hsl(' + this.percentage / 0.8 + ', 100%, 50%)'; 
                    },
                    
                    setColor: function() {
                        if (this.percentage <= 25) {
                            this.color = '#e9204f';
                        }
                        else if (this.percentage > 25 && this.percentage <= 50) {
                            this.color = '#ffa500'; 
                        } 
                        else if (this.percentage > 50 && this.percentage <= 75) {
                            this.color = '#bd28bd';
                        } 
                        else if (this.percentage > 75 && this.percentage < 100) {
                            this.color = 'ff0000';
                        }
                        
                        // Set color to blue when 100%
                        if (this.percentage == 100) {
                            this.color = '#231f20';
                        }
                    },
                    
                    draw: function() {
                        ctx.lineWidth = this.stroke;
                        ctx.strokeStyle = this.color;
                        ctx.setLineDash([]);
                        ctx.globalAlpha = 0.2;
                        
                        // Inner solid fill of circle
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.diameter, this.start, this.end, false);
                        ctx.stroke();
                        
                        ctx.globalAlpha = 1;
                        ctx.setLineDash([1, 4.1]);
                        ctx.lineWidth = this.stroke;
                        
                        // Inner dashed fill of circle
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.diameter, this.start, this.end, false);
                        ctx.stroke();
                        
                        ctx.lineWidth = 1;
                        ctx.setLineDash([]);
                        
                        // Inner solid stroke of circle
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.diameter - this.stroke / 2, 0, Math.PI * 2, false);
                        ctx.stroke();
                        
                        // Outer solid stroke of circle
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.diameter + this.stroke / 2, 0, Math.PI * 2, false);
                        ctx.stroke();
                        
                        ctx.font="700 100px Lato";
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = this.color;
                        
                        // Outer stroke of percentage text
                        ctx.strokeText(this.percentage + '%', this.x, this.y);
                        
                        // Inner fill of percentage text
                        ctx.globalAlpha = 0.2;
                        ctx.fillText(this.percentage + '%', this.x, this.y);
                        
                        range = 10;
                        speed = 0.02;
                        angle += speed;
                        
                        // Outer glow
                        ctx.shadowBlur = 20 + Math.sin(angle) * range;
                        ctx.shadowColor = this.color;
                    }
                };
                
                var angle = 0;
                var range = 10;
                var speed = 0.03;
                var t = 0;
                var duration = 2; // in seconds
                
                function loop() {
                    window.requestAnimationFrame(loop);
                    ctx.clearRect(0, 0, w, h);
                    
                    t += 100 / (duration * 60);
                    progressCircle.calcPercent(t);
                    progressCircle.setColor();
                    progressCircle.draw();
                }
                
                loop();
                
                window.addEventListener('resize', resize);
                
                function resize() {
                    w = canvas.width = window.innerWidth;
                    h = canvas.height = window.innerHeight;
                }
            }
        };
  
      
  
    }
  })();
  