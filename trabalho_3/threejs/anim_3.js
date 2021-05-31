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

	right_upper_leg: function(){
		let part =  robot.getObjectByName("right_upper_leg");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x + 0.5, pos.y + 0.5, 0 ) );
        part.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
	},

	left_upper_leg: function(){
		let part =  robot.getObjectByName("left_upper_leg");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x - 0.5, pos.y + 0.5, 0 ) );
        part.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
	},

	right_lower_leg: function(){
		let part =  robot.getObjectByName("right_upper_leg").getObjectByName("lower_leg");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x - 0.5, pos.y + 0.3, 0 ) );
        part.updateMatrixWorld(true);
        stats.update();
        renderer.render(scene, camera);
	},

	left_lower_leg: function(){
		let part =  robot.getObjectByName("left_upper_leg").getObjectByName("lower_leg");
		let pos = part.position;
        part.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(pos.x - 0.5, pos.y + 0.3, 0 ) );
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
		let rUpperArmDown = new TWEEN.Tween( {theta:Math.PI/4} ).to( {theta:0 }, 300).onUpdate(this.right_upper_arm);

		let lUpperArmUp = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/4 }, 300).onUpdate(this.left_upper_arm);
		let lUpperArmDown = new TWEEN.Tween( {theta:Math.PI/4} ).to( {theta:0 }, 300).onUpdate(this.left_upper_arm);


		// lower leg
		let rLowerLegUp = new TWEEN.Tween( {theta:-Math.PI/2} ).to( {theta:0 }, 800).onUpdate(this.right_lower_leg);
		let rLowerLegDown = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2 }, 800).onUpdate(this.right_lower_leg);

		let lLowerLegUp = new TWEEN.Tween( {theta:-Math.PI/2} ).to( {theta:0 }, 800).onUpdate(this.left_lower_leg);
		let lLowerLegDown = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2 }, 800).onUpdate(this.left_lower_leg);

		// upper legs
		let rUpperLegInitialUp = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/3 }, 800).onUpdate(this.right_upper_leg);
		let rUpperLegUp = new TWEEN.Tween( {theta:-Math.PI/6} ).to( {theta:Math.PI/3 }, 800).onUpdate(this.right_upper_leg);
		let rUpperLegDown = new TWEEN.Tween( {theta:Math.PI/3} ).to( {theta:-Math.PI/6 }, 800).onUpdate(this.right_upper_leg);

		let lUpperLegUp = new TWEEN.Tween( {theta:-Math.PI/4} ).to( {theta:Math.PI/4 }, 800).onUpdate(this.left_upper_leg);
		let lUpperLegDown = new TWEEN.Tween( {theta:Math.PI/4} ).to( {theta:-Math.PI/4 }, 800).onUpdate(this.left_upper_leg);
		let lUpperLegInitialDown = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/4 }, 800).onUpdate(this.left_upper_leg);


		// both lower arms up
		lowerArmsUp.start();

		// upper arms animation chain
		rUpperArmUp.start();
		rUpperArmUp.chain(lUpperArmUp);
		lUpperArmUp.chain(rUpperArmDown);
		rUpperArmDown.chain(lUpperArmDown);
		lUpperArmDown.chain(rUpperArmUp);

		// right leg animation chain
		rUpperLegInitialUp.start();
		rLowerLegDown.start();
		rUpperLegInitialUp.chain(rUpperLegDown, rLowerLegUp);
		rUpperLegDown.chain(rUpperLegUp, rLowerLegDown);
		rUpperLegUp.chain(rUpperLegDown, rLowerLegUp);

		// left leg animation chain
		lUpperLegInitialDown.start();
		lLowerLegDown.start();
		lUpperLegInitialDown.chain(lUpperLegUp, lLowerLegUp);
		lUpperLegDown.chain(lUpperLegUp, lLowerLegUp);
		lUpperLegUp.chain(lUpperLegDown, lLowerLegDown);

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
