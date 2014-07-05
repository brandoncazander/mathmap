from django import template
import markdown
try: import mdx_mathjax
except: pass

from django.template.defaultfilters import stringfilter
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def make_id(value):
	""" Converts periods to underscores to use in divs """
	return "i"+ value.replace(".", "_")

@register.filter
def get_pos_x(value):
	""" Gets x_pos for given position """
	return value.split(",")[0]

@register.filter
def get_pos_y(value):
	""" Gets y_pos for given position """
	return value.split(",")[1]

@register.filter
def split_csv(value):
	""" Gets ids of connected elements """
	return value.split(",")

@register.filter(is_safe=True)
@stringfilter
def my_markdown(value):
	extensions = ["mathjax"]
	return mark_safe(markdown.Markdown(force_unicode(value),
		extensions,
		safe_mode=True,
		enable_attributes=False))
