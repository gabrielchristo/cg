function WaveAnimation() {}

Object.assign( WaveAnimation.prototype, {

	right_lower_arm_animation: function(){
		let right_lower_arm = robot.getObjectByName("right_upper_arm").getObjectByName("lower_arm");
		let pos = right_lower_arm.position;

		right_lower_arm.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y, 0 ) );

		// Updating final world matrix (with parent transforms) - mandatory
        right_lower_arm.updateMatrixWorld(true);
        // Updating screen
        stats.update();
        renderer.render(scene, camera);
	},

    init: function() {

		// right upper arm animation
        let rightUpperArmTween = new TWEEN.Tween( {theta:0} )
            .to( {theta:2*Math.PI/3 }, 650)
            .onUpdate(function(){
                // This is an example of rotation of the right_upper_arm 
                // Notice that the transform is M = T * R 
                let right_upper_arm =  robot.getObjectByName("right_upper_arm");
				let pos = right_upper_arm.position;
                right_upper_arm.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y + 0.5, 0 ) );

                // Updating final world matrix (with parent transforms) - mandatory
                right_upper_arm.updateMatrixWorld(true);
                // Updating screen
                stats.update();
                renderer.render(scene, camera);    
            });

        // right lower arm up animation
        let rightLowerArmUpTween = new TWEEN.Tween({theta:0}).to({theta:Math.PI/3 }, 700).onUpdate(this.right_lower_arm_animation);

		// right lower arm down animation
        let rightLowerArmDownTween = new TWEEN.Tween({theta:Math.PI/3}).to({theta:0 }, 700).onUpdate(this.right_lower_arm_animation);
    
        
        // upper arm animation and then lower arm up
        rightUpperArmTween.start();       
		rightUpperArmTween.chain(rightLowerArmUpTween);

		// chain animation between lower arm up and down
		rightLowerArmUpTween.chain(rightLowerArmDownTween);
		rightLowerArmDownTween.chain(rightLowerArmUpTween);
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




