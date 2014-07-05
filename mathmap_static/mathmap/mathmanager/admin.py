from django.contrib import admin
from mathmanager.models import Math, Topic, Latex, Unistroke

# Register your models here.
class MathAdmin(admin.ModelAdmin):
	fieldsets = [
		(None,						{'fields': ['type', 'number']}),
		('Math Content',			{'fields': ['math']}),
		('Position & Connections',	{'fields': ['position', 'connections']}),
		('Tags',					{'fields': ['tags']}),
		('Options',					{'fields': ['oncanvas', 'user', 'datetime']})
	]
	list_display = ('type', 'number', 'position', 'connections', 'oncanvas')
	list_filter = ['type', 'oncanvas', 'tags']
	search_fields = ['connections']

class TopicAdmin(admin.ModelAdmin):
	fieldsets = [
		(None,						{'fields': ['title', 'content']})
	]

class UnistrokeAdmin(admin.ModelAdmin):
	list_filter = ['name']

admin.site.register(Math, MathAdmin)
admin.site.register(Topic, TopicAdmin)
admin.site.register(Latex)
admin.site.register(Unistroke, UnistrokeAdmin)