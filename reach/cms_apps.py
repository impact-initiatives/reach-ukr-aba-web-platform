from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

class ABAhook(CMSApp):
    app_name = "aba"
    name = _("ABA Apphook")

    def get_urls(self, page=None, language=None, **kwargs):
        return ["aba.urls"]       # replace this with the path to your application's URLs module

apphook_pool.register(ABAhook)