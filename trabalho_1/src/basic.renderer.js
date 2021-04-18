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

    // creates bounding box for given primitive array of vertices
    function create_bounding_box(primitive) {

    	// Bounding box for a circle
    	if(primitive.shape == "circle") {
    		
    		let center = primitive.center;
    		let radius = primitive.radius;

    		// Rectangle defined by smallest and largest values at X-axis and Y-axis
            let r = new Rectangle((center[0] - radius), (center[0] + radius), (center[1] - radius), (center[1] + radius));
            console.log("circle bounding box: ", r);

            return r;
    	}

    	// Bounding box for other convex polygons
    	else {
    		
    		let vertices = primitive.vertices;
    		
            // filtering x and y values
    		let x_values = vertices.map( (value) => { return value[0] });
    		let y_values = vertices.map( (value) => { return value[1] });

            console.log("vertices: ", vertices);
            console.log("x values: ", x_values);
            console.log("y values: ", y_values);

    		// Rectangle defined by smallest and largest values at X-axis and Y-axis
            let r = new Rectangle(Math.min(...x_values), Math.max(...x_values), Math.min(...y_values), Math.max(...y_values));
            console.log("polygon bounding box: ", r);

            return r;
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

            if(primitive.shape == "polygon"){

                // convert primitive vertices to array of points
                let vertices = [];
                primitive.vertices.forEach( (value) => {
                    vertices.push(new Point(value[0], value[1]));
                });

                // checking points order
                if(!is_polygon_clockwise(vertices)){
                    //console.log("Polygon is counter-clockwise. Reversing");
                    vertices.reverse();
                }
                
                return is_inside_convex_polygon(p, vertices);
            }
            
            return false;
    }

    // check the side of a line where a point is
    // it computes (y-y0)(x1-x0) - (x-x0)(y1-y0)
    // result < 0 : right side
    // result > 0 : left side
    function check_side(point, edge1, edge2) {
        return (point.x - edge2.x) * (edge1.y - edge2.y) - (edge1.x - edge2.x) * (point.y - edge2.y);
    }

    // check if a point p is inside a rectangle r
    function is_inside_rectangle(p, r) {
    	return ((p.x > r.x1 && p.x < r.x2) && (p.y > r.y1 && p.y < r.y2));
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

    // check if a polygon define by an array of points is clockwise
    function is_polygon_clockwise(polygon){
        let sum = 0;
        for (let i = 0; i < polygon.length - 1; i++) {
            let current = polygon[i], next = polygon[i+1];
            sum += (next.x - current.x) * (next.y + current.y);
        }
        return sum > 0;
    }

    // check if a point p is inside a convex and clockwise polygon defined by an array of points v
    function is_inside_convex_polygon(p, v) {

        let lo = 1, hi = v.length - 1;

        if (check_side(v[1], v[0], p) <= 0) return false;
        
        if (check_side(v[0], v[v.length - 1], p) <= 0) return false;

        while (hi - lo > 1)
        {
            let mid = (lo + hi) / 2;
            if (check_side(v[mid], v[0], p) > 0) lo = mid;
            else hi = mid;
        }

        return check_side(v[hi], v[lo], p) > 0;
    }
        
    
    function Screen( width, height, scene ) {
        this.width = width;
        this.height = height;
        this.scene = this.preprocess(scene); // array of primitives
        this.bounding_boxes = this.process_bounding_boxes(scene); // array of bounding boxes
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

            // return array of all primitives rectangle bounding boxes
            process_bounding_boxes: function(scene) {
                let rectanglesArray = [];
                for(var primitive of scene){
                    rectanglesArray.push(create_bounding_box(primitive));
                }
                return rectanglesArray;
            },

            // creates a matrix height x width x 3 with value 255 at all entries
            createImage: function() {
                this.image = nj.ones([this.height, this.width, 3]).multiply(255);
            },

            rasterize: function() {
                var color;
         
                // In this loop, the image attribute must be updated after the rasterization procedure.
                for( var primitive of this.scene) {

                    // getting current bounding box rectangle
                    let currentIndex = scene.indexOf(primitive);
                    let currentBoundingBox = this.bounding_boxes[currentIndex];

                    // Loop through all pixels
                    // Use bounding boxes in order to speed up this loop
                    for (var i = currentBoundingBox.x1; i < currentBoundingBox.x2; i++) {
                        var x = i + 0.5;
                        for( var j = currentBoundingBox.y1; j < currentBoundingBox.y2; j++) {
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

