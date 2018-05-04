/* MIT-LICENSE */
/*
Copyright (c) 2009 Satoshi Ueyama

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Any comments? Send @reply on http://twitter.com/gyuque

function ClothApp()
{
	this.canvas = document.getElementById("cv");

	P3D.g = this.canvas.getContext("2d");

	var tex = new Image();
	this.texture1 = tex;
	tex.onload = function(){ _this.start(); };
	tex.src = "http://img.f.hatena.ne.jp/images/fotolife/g/gyuque/20090226/20090226032826.gif";

	tex = new Image();
	this.texture2 = tex;
	tex.onload = function(){ _this.start(); };
	tex.src = "http://img.f.hatena.ne.jp/images/fotolife/g/gyuque/20090226/20090226032825.png";

	this.mLoadCount = 2;
	this.mTickCount = 0;

	this.G = 0.53;
	this.G1 = 0.45;
	this.mProjMat  = null;
	this.mViewMat  = null;
	this.mViewFrom = new Vec3();
	this.mViewFrom.y = -150;
	this.mViewFrom.z = 1000;
	this.mViewFromA = (new Vec3()).copyFrom(this.mViewFrom);

	this.mViewAngle = 0;

	this.mNLen = 0;
	this.mNodes = [];
	this.mRenderTris = null;

	this.mLTNode = null;
	this.mRTNode = null;

	this.mLTNodeV = new Vec3();
	this.mRTNodeV = new Vec3();

	this.mWForce = new Vec3();
	this.frate = 15;

	var _this = this;
}

ClothApp.zsortCmp = function(t1, t2) {
	return t2.sortKey - t1.sortKey;
}

ClothApp.prototype = {
	start: function() {
		if (--this.mLoadCount != 0) return;

		this.vUP = new Vec3(0,  1, 0);
		this.vAT = new Vec3(0, 80, 0);

		this.mViewport = {};
		this.mViewport.w = 480;
		this.mViewport.h = 300;
		this.mViewport.ow = 240;
		this.mViewport.oh = 150;
		this.setupTransforms();

		this.generateCloth(180);
		this.generateRenderTriangles();

		var _this = this;
		this.canvas.addEventListener("mousemove", function(e){_this.onMouseMove(e);}, false);
		this.canvas.addEventListener("mousedown", function(e){_this.onClick(e);}, false);

		window.setTimeout(function(){_this.onInterval();}, this.frate);
	},

	onInterval: function() {
		this.mTickCount++;

		// this.mLTNodeV.z = Math.cos(this.mTickCount*0.1) * 2;

		this.tick();
		this.updatePosition();
		this.draw();


		var _this = this;
		window.setTimeout(function(){_this.onInterval();}, this.frate);
	},

	onMouseMove: function(e) {
		if (e.clientX || e.clientX == 0)
			this.mViewAngle = (e.clientX - 240) * 0.004;

		if (e.clientY || e.clientY == 0)
			this.mViewFromA.y = 90 - (e.clientY - 0) * 0.8;
	},

	onClick: function(e) {
		if (e.clientX || e.clientX == 0)
		{
			this.mWForce.z = -4;
			this.mWForce.x = (e.clientX - 240) * -0.03;
		}
	},

	tick: function() {
		this.updateViewTrans(this.mViewAngle);

		var nlen = this.mNodes.length;
		var i, nd;
		for(i = 0;i < nlen;i++)
		{
			nd = this.mNodes[i];
			nd.F.x = 0;
			nd.F.z = 0;
			if (nd.flags & 4)
				nd.F.y = -this.G1;
			else
				nd.F.y = -this.G;

			nd.F.add(this.mWForce);
		}


		this.mWForce.zero();
		this.applyTension();

		for(i = 0;i < nlen;i++)
		{
			nd = this.mNodes[i];

			if ((nd.flags&1) != 0) {
				nd.F.sub(nd.F);
			}

			nd.velo.add(nd.F);
		}

		this.mLTNode.velo.copyFrom(this.mLTNodeV);
		this.mRTNode.velo.copyFrom(this.mRTNodeV);
	},

	updatePosition: function() {
		var nlen = this.mNodes.length;
		var i, nd;
		for(i = 0;i < nlen;i++)
		{
			nd = this.mNodes[i];

			if ((nd.flags&1) != 0) {
				nd.cv.x = 0;
				nd.cv.y = 0;
				nd.cv.z = 0;
			}

			nd.pos.add(nd.velo);
			nd.velo.sub(nd.cv);
			nd.cv.x = 0;
			nd.cv.y = 0;
			nd.cv.z = 0;

			nd.velo.smul(0.95);
		}
	},

	draw: function() {
		P3D.clear("#000", this.mViewport.w, this.mViewport.h);
		this.transformPolygons();

		this.mRenderTris.sort(ClothApp.zsortCmp);
		var len = this.mRenderTris.length;
		var t, sh;
		for (var i = 0;i < len;i++) {
			t = this.mRenderTris[i];

			if (P3D.texture != t.texture)
				P3D.texture = t.texture;

			sh = undefined;
			if (t.lighting && t.shade > 0.01)
				sh = "rgba(0,0,0,"+t.shade+")";
			P3D.drawTriangle(t.tposs, t.uvs, sh);
		}
	},

	applyTension: function() {
		var i, k, nd;
		var v = new Vec3();
		var nlen = this.mNodes.length;
		var naturalLen = this.mNLen;

		for (k = 0;k < nlen;k++)
		{
			nd = this.mNodes[k];
			var F = nd.F;

			for (i = 0;i < 4;i++)
			{
				var nbr = nd.links[i];
				if (!nbr) continue;

				var len = v.copyFrom(nbr.pos).sub(nd.pos).norm();
				var dlen = len - naturalLen;
				if (dlen > 0) {
					v.smul(dlen * 0.5 / len);

					F.x += v.x;
					F.y += v.y;
					F.z += v.z;
					nd.cv.add(v.smul(0.8));
				}
			}
		}	
	},

	setupTransforms: function() {
		this.mProjMat = new M44();
		this.mProjMat.perspectiveLH(24, 15, 10, 9000);

		this.mViewMat = new M44();
		this.updateViewTrans(0);
	},

	updateViewTrans: function(ry) {
		this.mViewFromA.z = Math.cos(ry) * 380;
		this.mViewFromA.x = Math.sin(ry) * 380;

		this.mViewFrom.smul(0.7);
		this.mViewFrom.x += this.mViewFromA.x * 0.3;
		this.mViewFrom.y += this.mViewFromA.y * 0.3;
		this.mViewFrom.z += this.mViewFromA.z * 0.3;

		this.mViewMat.lookAtLH(this.vUP, this.mViewFrom, this.vAT);
	},

	generateCloth: function(base_y) {
		var cols = 9;
		var rows = 8;
		
		var step   = 22;
		this.mNLen = step*0.9;
		var w = (cols-1) * step;

		var i, k;
		for (k = 0;k < rows;k++)
		{
			for (i = 0;i < cols;i++)
			{
				var nd = new ClothNode();
				nd.pos.x = -(w/2) + i*step;
				nd.pos.y = base_y -k*step/2;
				nd.pos.z = k*16;

				nd.uv.u = i / (cols-1);
				nd.uv.v = k / (rows-1);

				if (i > 0) {
					var prv_nd = this.mNodes[this.mNodes.length-1];
					prv_nd.links[1] = nd;
					nd.links[0] = prv_nd;
				}

				if (k > 0) {
					var up_nd = this.mNodes[this.mNodes.length-cols];
					up_nd.links[4] = nd;
					nd.links[3] = up_nd;
				}

				if (i != 0 && i != 4 && i != (cols-1))
					nd.flags |= 4;

				this.mNodes.push(nd);
			}
		}

		// fix left-top and right-top
		this.mNodes[0     ].flags |= 1;
		this.mNodes[4     ].flags |= 1;
		this.mNodes[cols-1].flags |= 1;

		this.mLTNode = this.mNodes[0     ];
		this.mRTNode = this.mNodes[cols-1];
	},

	generateRenderTriangles: function()
	{
		if (!this.mRenderTris) this.mRenderTris = [];

		var i;
		var nd;
		var nlen = this.mNodes.length;

		for(i = 0;i < nlen;i++)
		{
			nd = this.mNodes[i];
			if (nd.links[1] && nd.links[1].links[4]) {
				var t = new RenderTriangle();
				t.texture = this.texture1;

				t.poss[0] = nd.pos;
				t.poss[1] = nd.links[1].pos;
				t.poss[2] = nd.links[1].links[4].pos;

				t.uvs[0]  = nd.uv;
				t.uvs[1]  = nd.links[1].uv;
				t.uvs[2]  = nd.links[1].links[4].uv;

				this.mRenderTris.push(t);

				t = new RenderTriangle();
				t.texture = this.texture1;

				t.poss[0] = nd.pos;
				t.poss[1] = nd.links[1].links[4].pos;
				t.poss[2] = nd.links[4].pos;

				t.uvs[0]  = nd.uv;
				t.uvs[1]  = nd.links[1].links[4].uv;
				t.uvs[2]  = nd.links[4].uv;

				this.mRenderTris.push(t);
			}
		}

		this.addBGTriangles(this.mNodes[0].pos.y);
	},

	addBGTriangles: function(by) {
		var cols = 4;
		var t, x, y, sz = 110;
		var ox = -(cols*sz)/2;
		var oz = -(cols*sz)/2;

		for (y = 0;y < cols;y++) {
			for (x = 0;x < cols;x++) {
				var bv = ((x+y)&1) * 0.5;
				t = new RenderTriangle();
				t.texture = this.texture2;

				t.poss[0] = new Vec3(ox + x*sz     , by, oz + y*sz     );
				t.poss[1] = new Vec3(ox + x*sz + sz, by, oz + y*sz     );
				t.poss[2] = new Vec3(ox + x*sz     , by, oz + y*sz + sz);

				t.uvs[0]  = {u:0  , v:bv    };
				t.uvs[1]  = {u:0.5, v:bv    };
				t.uvs[2]  = {u:0  , v:bv+0.5};

				if ((x==1 || x==2) && (y==1 || y==2))
					this.modifyRoofUV(t, x == 2, bv);

				t.lighting = false;
				t.zBias = 0.5;
				this.mRenderTris.push(t);

				t = new RenderTriangle();
				t.texture = this.texture2;

				t.poss[0] = new Vec3(ox + x*sz     , by, oz + y*sz + sz);
				t.poss[1] = new Vec3(ox + x*sz + sz, by, oz + y*sz    );
				t.poss[2] = new Vec3(ox + x*sz + sz, by, oz + y*sz + sz);

				t.uvs[0]  = {u:0  , v:bv+0.5};
				t.uvs[1]  = {u:0.5, v:bv    };
				t.uvs[2]  = {u:0.5, v:bv+0.5};

				if ((x==1 || x==2) && (y==1 || y==2))
					this.modifyRoofUV(t, x == 2, bv);

				t.lighting = false;
				t.zBias = 0.5;
				this.mRenderTris.push(t);

			}
		}
	},

	modifyRoofUV: function(t, rv, bv) {
		if (rv) {
			t.uvs[0].u = 0.5 - t.uvs[0].u;
			t.uvs[1].u = 0.5 - t.uvs[1].u;
			t.uvs[2].u = 0.5 - t.uvs[2].u;
		}

		t.uvs[0].u += 0.5;
		t.uvs[1].u += 0.5;
		t.uvs[2].u += 0.5;

		if (rv) {
			t.uvs[0].v = 0.5 - t.uvs[0].v + bv + bv;
			t.uvs[1].v = 0.5 - t.uvs[1].v + bv + bv;
			t.uvs[2].v = 0.5 - t.uvs[2].v + bv + bv;
		}

	},

	transformPolygons: function() {
		var trans = new M44();
		trans.mul(this.mViewMat, this.mProjMat);

		var hw = this.mViewport.ow;
		var hh = this.mViewport.oh;

		var len = this.mRenderTris.length;
		var t;
		var spos = [0, 0, 0, 0];
		for (var i = 0;i < len;i++) {
			t = this.mRenderTris[i];
			for (var k = 0;k < 3;k++) {
				trans.transVec3(spos, t.poss[k].x, t.poss[k].y, t.poss[k].z);

				var W = spos[3];
				spos[0] /= W;
				spos[1] /= W;
				spos[2] /= W;

				spos[0] *= this.mViewport.w;
				spos[1] *= -this.mViewport.h;
				spos[0] += hw;
				spos[1] += hh;

				t.tposs[k].x = spos[0];
				t.tposs[k].y = spos[1];
				t.tposs[k].z = spos[2];
			}

			var v1 = (new Vec3()).copyFrom(t.poss[1]).sub(t.poss[0]).normalize();
			var v2 = (new Vec3()).copyFrom(t.poss[2]).sub(t.poss[1]).normalize();
			var N = (new Vec3()).cp(v1, v2);

			trans.transVec3Rot(spos, N.x, N.y, N.z);

			if (t.lighting) {
				if (spos[2] > 0)
					t.shade = 0.8
				else {
					t.shade = 0.1 - N.y * 0.6;
					if (t.shade < 0) t.shade = 0;
				}
			}

			t.sortKey = Math.floor( (t.tposs[0].z + t.tposs[1].z + t.tposs[2].z + t.zBias) *1000 );
		}
	}
}

function ClothNode()
{
	this.flags = 0;
	this.pos  = new Vec3();
	this.velo = new Vec3();
	this.cv   = new Vec3();
	this.F    = new Vec3();
	this.links = [null, null, null, null];
	this.uv = {u:0, v:0};
}


function RenderTriangle()
{
	this.texture = null;
	this.poss  = new Array(3);
	this.tposs = [new Vec3(), new Vec3(), new Vec3()];
	this.uvs = [{u:0, v:0}, {u:0, v:0}, {u:0, v:0}];
	this.shade = 0;
	this.lighting = true;
	this.zBias = 0;

	this.sortKey = 0;
}
