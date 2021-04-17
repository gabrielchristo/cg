(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';


    /* ------------------------------------------------------------ */

    // point class definition
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }

    // rectangle class definition
    class Rectangle {
        constructor(x1, x2, y1, y2) {
            this.x1 = x1;
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;
        }
    }
        
    function inside(  x, y, primitive  ) {
            // You should implement your inside test here for all shapes   
            // for now, it only returns a false test

            let p = new Point(x,y);

            if(primitive.shape == "triangle"){

                let vertices = primitive.vertices;

                let v1 = new Point(vertices[0][0], vertices[0][1]);
                let v2 = new Point(vertices[1][0], vertices[1][1]);
                let v3 = new Point(vertices[2][0], vertices[2][1]);
                return is_inside_triangle(p, v1, v2, v3);
            }

            if(primitive.shape == "circle"){
                let center = new Point(primitive.center[0], primitive.center[1]);
                return is_inside_circle(p, center, primitive.radius);
            }
            
            return false;
    }

    // check the side of a line where a point is
    function check_side(point, edge1, edge2) {
        return (point.x - edge2.x) * (edge1.y - edge2.y) - (edge1.x - edge2.x) * (point.y - edge2.y);
    }

    // check if a point p is inside a triangle with vertices v1, v2 and v3
    function is_inside_triangle(p, v1, v2, v3) {

        let d1 = check_side(p, v1, v2);
        let d2 = check_side(p, v2, v3);
        let d3 = check_side(p, v3, v1);

        let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    // check if a point p is inside a circle with center c and radius r
    function is_inside_circle(p, c, r) {
        return (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2)) < Math.pow(r, 2);
    }
        
    
    function Screen( width, height, scene ) {
        this.width = width;
        this.height = height;
        this.scene = this.preprocess(scene); // array of primitives 
        this.createImage(); 
    }

    Object.assign( Screen.prototype, {

            preprocess: function(scene) {
                // Possible preprocessing with scene primitives, for now we don't change anything
                // You may define bounding boxes, convert shapes, etc
                
                var preprop_scene = [];

                for( var primitive of scene ) {  
                    // do some processing
                    // for now, only copies each primitive to a new list

                    preprop_scene.push( primitive );
                    
                }

                
                return preprop_scene;
            },

            // creates a matrix height x width x 3 with value 255 at all entries
            createImage: function() {
                this.image = nj.ones([this.height, this.width, 3]).multiply(255);
            },

            rasterize: function() {
                var color;
         
                // In this loop, the image attribute must be updated after the rasterization procedure.
                for( var primitive of this.scene ) {

                    // Loop through all pixels
                    // Use bounding boxes in order to speed up this loop
                    for (var i = 0; i < this.width; i++) {
                        var x = i + 0.5;
                        for( var j = 0; j < this.height; j++) {
                            var y = j + 0.5;

                            // First, we check if the pixel center is inside the primitive 
                            if ( inside( x, y, primitive ) ) {
                                // only solid colors for now
                                color = nj.array(primitive.color);
                                this.set_pixel( i, this.height - (j + 1), color );
                            }
                            
                        }
                    }
                }
                
               
              
            },

            set_pixel: function( i, j, colorarr ) {
                // We assume that every shape has solid color
         
                this.image.set(j, i, 0,    colorarr.get(0));
                this.image.set(j, i, 1,    colorarr.get(1));
                this.image.set(j, i, 2,    colorarr.get(2));
            },

            update: function () {
                // Loading HTML element
                var $image = document.getElementById('raster_image');
                $image.width = this.width; $image.height = this.height;

                // Saving the image
                nj.images.save( this.image, $image );
            }
        }
    );

    exports.Screen = Screen;
    
})));

