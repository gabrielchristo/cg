(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.ImageProcessing = {}));
}(this, (function (exports) { 'use strict';



    function ImageProcesser(img, kernel = null, xform = null, bhandler = 'icrop') {
        this.img = img.clone();
        this.height = img.shape[0];
        this.width = img.shape[1];
        this.kernel = kernel;
        this.xform = xform;
        this.bhandler = bhandler;
    }

    Object.assign( ImageProcesser.prototype, {

        apply_kernel: function(border = 'icrop') {
            // Method to apply kernel over image (incomplete)
            // border: 'icrop' is for cropping image borders, 'extend' is for extending image border
            // You may create auxiliary functions/methods if you'd like
            
            var source_img = this.img;
            let extend_edge = Boolean(false);
            let new_height = this.height;
            let new_width = this.width;

            if(border == 'extend') {
                
                extend_edge = Boolean(true);
                new_height = this.height + 2;
                new_width = this.width + 2;
                var new_img = nj.zeros([new_height, new_width]);
                
                for (var index_i = 0; index_i < new_height; index_i++) {
                    for (var index_j = 0; index_j < new_width; index_j++) {
                        if (index_i == 0) {
                            if (index_j == 0) {
                                new_img.set((index_i, index_j, source_img.get(index_i + 1, index_j + 1)));
                            }

                            else if (index_j == new_width) {
                                new_img.set((index_i, index_j, source_img.get(index_i + 1, index_j - 1)));
                            }

                            else {
                                new_img.set((index_i, index_j, source_img.get(index_i + 1, index_j)));
                            }
                        }

                        else if (index_j == 0) {
                            if (index_i == 0) {
                                new_img.set((index_i, index_j, source_img.get(index_i + 1, index_j + 1)));
                            }

                            else if (index_i == new_height) {
                                new_img.set((index_i, index_j, source_img.get(index_i - 1, index_j + 1)));
                            }

                            else {
                                new_img.set((index_i, index_j, source_img.get(index_i, index_j + 1)));
                            }
                        }

                        else if (index_j == new_width) {
                            if (index_i == 0) {
                                new_img.set((index_i, index_j, source_img.get(index_i + 1, index_j - 1)));
                            }

                            else if (index_i == new_height) {
                                new_img.set((index_i, index_j, source_img.get(index_i - 1, index_j - 1)));
                            }

                            else {
                                new_img.set((index_i, index_j, source_img.get(index_i, index_j - 1)));
                            }
                        }

                        else if (index_i == new_height) {
                            if (index_j == 0) {
                                new_img.set((index_i, index_j, source_img.get(index_i - 1, index_j + 1)));
                            }

                            else if (index_j == new_width) {
                                new_img.set((index_i, index_j, source_img.get(index_i - 1, index_j - 1)));
                            }

                            else {
                                new_img.set((index_i, index_j, source_img.get(index_i - 1, index_j)));
                            }
                        }

                        else {
                            new_img.set((index_i, index_j, source_img.get(index_i, index_j)));
                        }
                    }
                }
            }


            // Aplica box filter
            if (this.kernel == "box") {
                
                if (!extend_edge) {
                    var new_img = nj.zeros([this.height,this.width]);
                }

                for (var i = 1; i < new_height - 1; i++) {
                    for (var j = 1; j < new_width - 1; j++) {
                        var new_pixel_value = 
                            (source_img.get(i - 1, j - 1) +
                            source_img.get(i + 0, j - 1) +
                            source_img.get(i + 1, j - 1) +
                            source_img.get(i - 1, j + 0) +
                            source_img.get(i + 0, j + 0) +
                            source_img.get(i + 1, j + 0) +
                            source_img.get(i - 1, j + 1) +
                            source_img.get(i + 0, j + 1) +
                            source_img.get(i + 1, j + 1)) / 9;

                        new_img.set(i, j, new_pixel_value);
                    }
                }
            }

            // Aplica sobel
            else if (this.kernel == "sobel") {
                
                if (!extend_edge) {
                    var new_img = nj.zeros([this.height,this.width]);
                }

                for (var i = 1; i < new_height - 1; i++) {
                    for (var j = 1; j < new_width - 1; j++) {
                        var x_pixel_value = 
                            ((source_img.get(i - 1, j - 1) * -1) +
                            (source_img.get(i + 0, j - 1) * -2) +
                            (source_img.get(i + 1, j - 1) * -1) +
                            (source_img.get(i - 1, j + 0) * 0) +
                            (source_img.get(i + 0, j + 0) * 0) +
                            (source_img.get(i + 1, j + 0) * 0) +
                            (source_img.get(i - 1, j + 1) * 1) +
                            (source_img.get(i + 0, j + 1) * 2) +
                            (source_img.get(i + 1, j + 1) * 1)) / 8;

                        var y_pixel_value =                         
                            ((source_img.get(i - 1, j - 1) * 1) +
                            (source_img.get(i + 0, j - 1) * 0) +
                            (source_img.get(i + 1, j - 1) * -1) +
                            (source_img.get(i - 1, j + 0) * 2) +
                            (source_img.get(i + 0, j + 0) * 0) +
                            (source_img.get(i + 1, j + 0) * -2) +
                            (source_img.get(i - 1, j + 1) * 1) +
                            (source_img.get(i + 0, j + 1) * 0) +
                            (source_img.get(i + 1, j + 1) * -1)) / 8;

                        var new_pixel_value = Math.sqrt((x_pixel_value ** 2) + (y_pixel_value ** 2));
                        new_img.set(i, j, new_pixel_value);

                    }
                }
            }

            // Aplica laplace
            else if (this.kernel == "laplace") {
                
                if (!extend_edge) {
                    var new_img = nj.zeros([this.height,this.width]);
                }

                for (var i = 1; i < new_height - 1; i++) {
                    for (var j = 1; j < new_width - 1; j++) {
                        var new_pixel_value = 
                            ((source_img.get(i - 1, j - 1) * 0) +
                            (source_img.get(i + 0, j - 1) * -1) +
                            (source_img.get(i + 1, j - 1) * 0) +
                            (source_img.get(i - 1, j + 0) * -1) +
                            (source_img.get(i + 0, j + 0) * 4) +
                            (source_img.get(i + 1, j + 0) * -1) +
                            (source_img.get(i - 1, j + 1) * 0) +
                            (source_img.get(i + 0, j + 1) * -1) +
                            (source_img.get(i + 1, j + 1) * 0)) / 4;

                        new_img.set(i, j, Math.abs(new_pixel_value));

                    }
                }
            }

            this.img = new_img;
        },

        apply_xform: function()  {

            var a = this.xform.get(0, 0), b = this.xform.get(0, 1), c = this.xform.get(0, 2);
            var d = this.xform.get(1, 0), e = this.xform.get(1, 1), f = this.xform.get(1, 2);
            var g = this.xform.get(2, 0), h = this.xform.get(2, 1), i = this.xform.get(2, 2);
            var A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
            var D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g);
            var G = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d;
            var det = a * A + b * B + c * C;
            const inverse_xform = nj.zeros([3, 3]);
            inverse_xform.set(0, 0, A / det);
            inverse_xform.set(1, 0, B / det);
            inverse_xform.set(2, 0, C / det);
            inverse_xform.set(0, 1, D / det);
            inverse_xform.set(1, 1, E / det);
            inverse_xform.set(2, 1, F / det);
            inverse_xform.set(0, 2, G / det);
            inverse_xform.set(1, 2, H / det);
            inverse_xform.set(2, 2, I / det);

            const new_img = nj.zeros([this.height, this.width]);

            for (var y = 0; y < 2 * this.height; y++) {
                for (var x = 0; x < 2 * this.width; x++) {
                    // var original = (nj.array([x, y, 1]).T).dot(inverse_xform);
                    var original = xform.dot(nj.array([x, y, 1]).T);
                    var original_x = original.get(0), original_y = original.get(1);
                    if (original_x < 0 || original_x >= this.width || original_y < 0 || original_y >= this.height) {
                        new_img.set(y + this.height, x + this.width, 255);
                    } else {
                        var low_x = Math.floor(original_x);
                        var high_x = low_x + 1;
                        var low_y = Math.floor(original_y);
                        var high_y = low_y + 1;
                        var a = original_x - low_x, b = original_y - low_y;

                        var result = (1 - a) * (1 - b) * this.img.get(low_y, low_x) + a * (1 - b) * this.img.get(low_y, high_x)
                            + a * b * this.img.get(high_y, high_x) + (1 - a) * b * this.img.get(high_y, low_x);

                        new_img.set(y, x, result);
                    }
                }
            }

            this.img = new_img;
            this.height = this.img.shape[0];
            this.width = this.img.shape[1];
        },

        update: function() {
            // Method to process image and present results
            var start = new Date().valueOf();

            if(this.kernel != null) {
                this.apply_kernel(this.bhandler);
            }

            if(this.xform != null) {
                this.apply_xform();
            }

            // Loading HTML elements and saving
            var $transformed = document.getElementById('transformed');
            $transformed.width = this.width; 
            $transformed.height = this.height;
            nj.images.save(this.img, $transformed);
            var duration = new Date().valueOf() - start;
            document.getElementById('duration').textContent = '' + duration;
        }

    } )


    exports.ImageProcesser = ImageProcesser;
    
    
})));

