function GuitarAnimation() {}

Object.assign(GuitarAnimation.prototype, {

	right_arm_animation: function(){
		let part = robot.getObjectByName("right_upper_arm");
		let pos = part.position;
		part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y + 0.5, 0 ) );
		part.updateMatrixWorld(true);
		stats.update();
		renderer.render(scene, camera);
	},

	left_upper_arm_animation: function(){
		let part = robot.getObjectByName("left_upper_arm");
		let pos = part.position;
		part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y + 0.5, 0 ) );
		part.updateMatrixWorld(true);
		stats.update();
		renderer.render(scene, camera);
	},

	left_lower_arm_animation: function(){
		let part = robot.getObjectByName("left_upper_arm").getObjectByName("lower_arm");
		let pos = part.position;
		part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x + 1, pos.y + 1, 0 ) );
		part.updateMatrixWorld(true);
		stats.update();
		renderer.render(scene, camera);
	},

	init: function(){

		let a1 = new TWEEN.Tween( {theta:0} ).to( {theta:2*Math.PI/3.5 }, 650).onUpdate(this.right_arm_animation);
		let a2 = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/6 }, 650).onUpdate(this.left_upper_arm_animation);
		let a3 = new TWEEN.Tween( {theta:0} ).to( {theta:3*Math.PI/4 }, 650).onUpdate(this.left_lower_arm_animation);
		let a4 = new TWEEN.Tween( {theta:3*Math.PI/4} ).to( {theta: Math.PI/2}, 650).onUpdate(this.left_lower_arm_animation);
		let a5 = new TWEEN.Tween( {theta:Math.PI/2} ).to( {theta: 3*Math.PI/4}, 650).onUpdate(this.left_lower_arm_animation);

		// starting animation
		a1.start();
		a2.start();
		a2.chain(a3);
		a3.chain(a4);
		a4.chain(a5);
		a5.chain(a4);
	},

	animate: function(time) {
        window.requestAnimationFrame(this.animate.bind(this));
        TWEEN.update(time);
    },

    run: function() {
        this.init();
        this.animate(0);
    }
});