/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 5;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	this.Unistrokes[1] = new Unistroke("leftbracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	this.Unistrokes[2] = new Unistroke("rightbracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	this.Unistrokes[3] = new Unistroke("leftbrace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	this.Unistrokes[4] = new Unistroke("rightbrace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }