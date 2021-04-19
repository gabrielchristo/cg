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
                
                //return is_inside_convex_polygon(p, vertices);
                //return is_inside_polygon_by_crossing_number(p, vertices);
                return is_inside_polygon_by_winding_number(p, vertices);
            }
            
            return false;
    }

    // check the side of a line where a point is using dot product
    // it computes (y-y0)(x1-x0) - (x-x0)(y1-y0)
    // result < 0 : right side
    // result > 0 : left side
    // result = 0 : over the line
    function check_side(point, edge1, edge2) {
        return (point.x - edge2.x) * (edge1.y - edge2.y) - (edge1.x - edge2.x) * (point.y - edge2.y);
    }

    // check if a point p is inside a rectangle r
    function is_inside_rectangle(p, r) {
    	return ((p.x > r.x1 && p.x < r.x2) && (p.y > r.y1 && p.y < r.y2));
    }

    // check if a point p is at a rectangle r border
    function is_at_rectangle_border(p, r){

        // at least one checking must be zero
        // it means the point is exactly over some line of the rectangle
        let c1 = check_side(p, new Point(r.x1, r.y1), new Point(r.x2, r.y1));
        let c2 = check_side(p, new Point(r.x1, r.y2), new Point(r.x2, r.y2));
        let c3 = check_side(p, new Point(r.x1, r.y1), new Point(r.x1, r.y2));
        let c4 = check_side(p, new Point(r.x2, r.y1), new Point(r.x2, r.y2));

        return !c1 || !c2 || !c3 || !c4;
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

    // check if a polygon defined by an array of points is clockwise
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

        // if right side of clockwise polygon, point is out
        if (check_side(v[1], v[0], p) <= 0) return false;
        
        // same checking above, but with first and last polygon points
        if (check_side(v[0], v[v.length - 1], p) <= 0) return false;

        // if none of tests above failed, we need to check the others line segments by a binary search
        while (hi - lo > 1)
        {
            let mid = (lo + hi) / 2;
            if (check_side(v[mid], v[0], p) > 0) lo = mid;
            else hi = mid;
        }

        return check_side(v[hi], v[lo], p) > 0;
    }

    // check if a point p is inside a convex or non-convex polygon
    // based on pnpoly ray casting algorithm, which is based on the jordan curve theorem
    function is_inside_polygon_by_crossing_number(p, v) {
        
        let isInside = false;

        for(let i = 0, j = v.length - 1; i < v.length; j = i++){

            let condition1 = (v[i].y > p.y) != (v[j].y > p.y);
            let condition2 = p.x < (v[j].x - v[i].x) * (p.y - v[i].y) / (v[j].y - v[i].y) + v[i].x;

            if (condition1 && condition2)
                isInside = !isInside;
        }
        return isInside;
    }

    // check if a point p is inside a convex or non-convex polygon
    function is_inside_polygon_by_winding_number(p, v){

        let winding_number = 0;

        v.push(v[0]); // will connect the last vertice to the first, at the below loop, closing the polygon
  
        for (let i = 0; i < v.length - 1; i++) {

            if (v[i].y <= p.y) {                 
              if (v[i + 1].y > p.y)         
                if (check_side(v[i], v[i + 1], p) > 0) // checking p is at left of edge
                  ++winding_number;
            }

            else {                         
              if (v[i + 1].y <= p.y)
                if (check_side(v[i], v[i + 1], p) < 0) // checking p is at right of edge
                  --winding_number;
            }

        }
        return winding_number;
    }
        
    // return the result of two matrices multiplication (m1 x m2)
    function multiplyMatrices(m1, m2) {
        var result = [];
        for (var i = 0; i < m1.length; i++) {
            result[i] = [];
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    // apply transformation matrix to an array of points
    function transformation(v, t) {
        let vertices = v;
        for (var i = 0; i < vertices.length; i++) {
            vertices[i].push(1);
        }
        
        let transformed_vertices = [];
        let buffer_vector;
        let result;

        for (var i = 0; i < vertices.length; i++) {
            buffer_vector = [[0],[0],[0]];
            for (var j = 0; j < vertices[i].length; j++) {
                buffer_vector[j][0] = vertices[i][j]; // calculating transposed vector
            }
            result = multiplyMatrices(t,buffer_vector);
            result.pop();
            transformed_vertices.push(result);
        }
        return transformed_vertices
    }
			     
    function Screen( width, height, scene ) {
        this.width = width;
        this.height = height;
        this.scene = this.preprocess(scene); // array of primitives
        this.bounding_boxes = this.process_bounding_boxes(this.scene); // array of bounding boxes
        this.createImage(); 
    }

    Object.assign( Screen.prototype, {

            preprocess: function(scene) {
                // Possible preprocessing with scene primitives, for now we don't change anything
                // You may define bounding boxes, convert shapes, etc
                
                var preprop_scene = [];

                // loop through primitives
                for( var primitive of scene ) {
                    // do some processing
                    // for now, only copies each primitive to a new list

                    if (primitive.hasOwnProperty('xform')) {

                        if (primitive.shape == 'circle') {
                            // Nota: não conseguimos finalizar a transformação para círculos
                        }

                        else { // any polygon
                            primitive.vertices = transformation(primitive.vertices, primitive.xform);
                        }
                    }
                    preprop_scene.push(primitive);
                }

                console.log("pre processed scene: ", preprop_scene);
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
                    let currentIndex = this.scene.indexOf(primitive);
                    let currentBoundingBox = this.bounding_boxes[currentIndex];

                    // Loop through all pixels
                    // Use bounding boxes in order to speed up this loop
                    for (var i = currentBoundingBox.x1; i <= currentBoundingBox.x2; i++) {
                    //for (var i = 0; i < this.width; i++) {
                        var x = i + 0.5;
                        for( var j = currentBoundingBox.y1; j <= currentBoundingBox.y2; j++) {
                        //for( var j = 0; j < this.height; j++) {
                            var y = j + 0.5;

                            // First, we check if the pixel center is inside the primitive 
                            if ( inside( x, y, primitive ) ) {
                                // only solid colors for now
                                color = nj.array(primitive.color);
                                this.set_pixel( i, this.height - (j + 1), color );
                            }

                            // if at bounding box border, paint it black
                            if( is_at_rectangle_border(new Point(i, j), currentBoundingBox) ){
                                color = nj.array([0, 0, 0]);
                                //this.set_pixel( i, this.height - (j + 1), color );
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

