from django.db import models

# Create your models here.
class Math(models.Model):
	type = models.CharField(max_length=200)
	number = models.CharField(max_length=10)
	math = models.TextField()
	position = models.CommaSeparatedIntegerField(max_length=20)
	connections = models.CharField(max_length=200)
	tags = models.CharField(max_length=200, blank=True)
	oncanvas = models.BooleanField()
	user = models.CharField(max_length=100)
	datetime = models.DateTimeField()
	def __unicode__(self):  # Python 3: def __str__(self):
		return self.type + " " + self.number

class Topic(models.Model):
	title = models.CharField(max_length=200)
	content = models.TextField()

class Latex(models.Model):
	name = models.CharField(max_length=30)
	tex = models.CharField(max_length=50)
	def __str__(self):
		return self.name

class Unistroke(models.Model):
	name = models.CharField(max_length=30)
	unistroke = models.TextField()
	def __str__(self):
		return self.name