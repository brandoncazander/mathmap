import json

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.urlresolvers import reverse
from datetime import datetime

from mathmanager.models import Math, Topic, Latex, Unistroke

import markdown
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe

# Create your views here.
def index(request):
	all_maths = Math.objects.all().order_by('-number')
	canvas_maths = Math.objects.filter(oncanvas=True)
	library_maths = Math.objects.filter(oncanvas=False)
	context = {
		'all_maths': all_maths,
		'canvas_maths': canvas_maths,
		'library_maths': library_maths,
	}
	return render(request, 'mathmanager/index.html', context)

def list(request):
	all_maths = Math.objects.all().order_by('number')
	context = {
		'maths': all_maths,
	}
	return render(request, 'mathmanager/list.html', context)

def preview(request):
	if request.is_ajax():
		try:
			math = request.POST['math']
		except KeyError:
			return HttpResponse('Error')
		else:
			response_data = {}
			extensions = ["mathjax", ]
			response_data['math'] = mark_safe(markdown.markdown(force_unicode(math),
				extensions,
				safe_mode=True,
				enable_attributes=False))
			return HttpResponse(json.dumps(response_data), content_type="application/json")
	else:
		raise Http404

def latex(request):
	if request.is_ajax():
		try:
			name = request.POST['name']
			p = get_object_or_404(Latex, name=name)
		except KeyError:
			return HttpResponse('Error')
		else:
			response_data = {}
			response_data['code'] = p.tex
			return HttpResponse(json.dumps(response_data), content_type="application/json")
	else:
		raise Http404

def unistroke(request):
	if request.is_ajax():
		try:
			name = request.POST['name']
			unistroke = request.POST['unistroke']
			latex = request.POST['latex']
		except KeyError:
			return HttpResponse('Error')
		else:
			stroke = Unistroke(name=name, unistroke=unistroke)
			stroke.save()
			tex = Latex(name=name, tex=latex)
			tex.save()
			return HttpResponse("Saved")
	else:
		raise Http404

def draw(request):
	strokes = Unistroke.objects.all();
	context = {
		'unistrokes': strokes,
	}
	return render(request, 'mathmanager/draw.html', context)

def drawp(request):
	strokes = Unistroke.objects.all();
	context = {
		'unistrokes': strokes,
	}
	return render(request, 'mathmanager/drawp.html', context)

def topics(request):
	topics = Topic.objects.all()
	context = {
		'topics': topics,
	}
	return render(request, 'mathmanager/topics.html', context)

def add(request):
	if request.is_ajax():
		try:
			typeValue = request.POST['type']
			numberValue = request.POST['number']
			mathValue = request.POST['math']
			# userValue = request.POST['user']
			# datetimeValue = request.POST['datetime']
			tags = request.POST['tags']
		except KeyError:
			return HttpResponse('Error')
		else:
			userValue = "bcazander"
			datetimeValue = datetime.now()
			new = Math(type = typeValue, number = numberValue, math = mathValue, connections="0", position="0,0", tags = tags, oncanvas = True, user = userValue, datetime = datetimeValue)
			new.save();
			response_data = {}
			response_data['result'] = 'Success'
			# response_data['data_id'] = 5 #new.id
			response_data['id'] = "i"+ numberValue.replace(".", "_")
			return HttpResponse(json.dumps(response_data), content_type="application/json")
	else:
		raise Http404

def connection(request):
	if request.is_ajax():
		try:
			p = get_object_or_404(Math, pk=request.POST['id'])
			target = request.POST['target']
		except KeyError:
			return HttpResponse('Error')
		else:
			if p.connections == "0":
				p.connections = target
			else:
				p.connections += ","+ target
			p.save()
			return HttpResponse('Success')
	else:
		raise Http404

def canvas(request):
	if request.is_ajax():
		try:
			p_id = request.POST['id']
			p = get_object_or_404(Math, pk=p_id)
			pos = request.POST['position']
		except KeyError:
			return HttpResponse('Error')
		else:
			p.oncanvas = True
			p.position = pos
			p.save()
			return HttpResponse(p_id +": "+ pos)
	else:
		raise Http404

def get(request):
	if request.is_ajax():
		try:
			p_id = request.POST['id']
			p = get_object_or_404(Math, pk=p_id)
		except KeyError:
			return HttpResponse('Error')
		else:
			response_data = {}
			response_data['type'] = p.type
			response_data['data_id'] = p.id
			response_data['id'] = "i"+ p.number.replace(".", "_")
			response_data['number'] = p.number
			extensions = ["mathjax", ]
			response_data['math'] = mark_safe(markdown.markdown(force_unicode(p.math),
				extensions,
				safe_mode=True,
				enable_attributes=False))
			return HttpResponse(json.dumps(response_data), content_type="application/json")
	else:
		raise Http404

def position(request):
	if request.is_ajax():
		try:
			p_id = request.POST['id']
			p = get_object_or_404(Math, pk=p_id)
			pos = request.POST['position']
		except KeyError:
			return HttpResponse('Error')
		else:
			p.position = pos
			p.save()
			return HttpResponse(p_id +": "+ pos)
	else:
		raise Http404

def clear_canvas(request):
	if request.is_ajax():
		Math.objects.all().update(oncanvas=False, connections="0")
		return HttpResponse('Success')
	else:
		raise Http404

def close(request):
	if request.is_ajax():
		try:
			p_id = request.POST['id']
			p = get_object_or_404(Math, pk=p_id)
		except KeyError:
			return HttpResponse('Error')
		else:
			p.oncanvas = False
			p.save()
			return HttpResponse(p_id +" removed.")
	else:
		raise Http404
