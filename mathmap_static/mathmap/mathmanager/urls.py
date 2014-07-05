from django.conf.urls import patterns, url

from mathmanager import views

urlpatterns = patterns('',
	# ex: /math/
	url(r'index', views.index, name='index'),
	url(r'^$', views.list, name='list'),
	# ex: /add/
	url(r'add/', views.add, name='add'),
	# ex: /position/
	url(r'position/', views.position, name='position'),
	# ex: /connection/
	url(r'connection/', views.connection, name='connection'),
	# ex: /canvas/
	url(r'canvas/', views.canvas, name='canvas'),
	# ex: /clear_canvas/
	url(r'clear_canvas', views.clear_canvas, name='clear_canvas'),
	# ex: /list/
	url(r'list/', views.list, name='list'),
	# ex: /topics/
	url(r'topics/', views.topics, name='topics'),
	# ex: /get/
	url(r'get/', views.get, name='get'),
	# ex: /close/
	url(r'close/', views.close, name='close'),
	url(r'draw/', views.draw, name='draw'),
	url(r'drawp/', views.drawp, name='drawp'),
	url(r'unistroke/', views.unistroke, name='unistroke'),
	url(r'preview/', views.preview, name='preview'),
	url(r'latex/', views.latex, name='latex'),

)
