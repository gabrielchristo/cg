function RunAnimation() {}

Object.assign(RunAnimation.prototype, {

	right_upper_arm: function(){
		let part =  robot.getObjectByName("right_upper_arm");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y, 0 ) );
        part.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
	},

	left_upper_arm: function(){
		let part =  robot.getObjectByName("left_upper_arm");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x + 1, pos.y, 0 ) );
        part.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
	},

	init: function(){

		// begin with both lower arms up
		let lowerArmsUp = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/4 }, 650).onUpdate(function(){
			["right_upper_arm", "left_upper_arm"].forEach((parent)=>{
				let part =  robot.getObjectByName(parent).getObjectByName("lower_arm");
				let pos = part.position;
            	part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x, pos.y, 0 ) );
            	part.updateMatrixWorld(true);
        		stats.update();
            	renderer.render(scene, camera);    
			});
		});

		// upper arms with alternate rotation
		let rUpperArmUp = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/4 }, 300).onUpdate(this.right_upper_arm);
		let rUpperArmDown = new TWEEN.Tween( {theta:Math.PI/4} ).to( {theta:0 }, 600).onUpdate(this.right_upper_arm);

		let lUpperArmUp = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/4 }, 300).onUpdate(this.left_upper_arm);
		let lUpperArmDown = new TWEEN.Tween( {theta:Math.PI/4} ).to( {theta:0 }, 600).onUpdate(this.left_upper_arm);


		// lower leg
		// upper legs


		// starting
		lowerArmsUp.start();

		rUpperArmUp.start();
		
		rUpperArmUp.chain(lUpperArmUp);

		lUpperArmUp.chain(rUpperArmDown);

		rUpperArmDown.chain(lUpperArmDown);

		lUpperArmDown.chain(rUpperArmUp);

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



