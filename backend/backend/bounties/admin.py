from django.contrib import admin
from .models import Bounty, BountyRewardCategory, BountyReward, BountyAssetInScope, BountyImpactInScope

class BountyRewardInline(admin.TabularInline):
    model = BountyReward
    extra = 1

class BountyRewardCategoryInline(admin.TabularInline):
    model = BountyRewardCategory
    extra = 1
    inlines = [BountyRewardInline]

class BountyAssetInScopeInline(admin.TabularInline):
    model = BountyAssetInScope
    extra = 1

class BountyImpactInScopeInline(admin.TabularInline):
    model = BountyImpactInScope
    extra = 1

class BountyAdmin(admin.ModelAdmin):
    exclude = ('last_updated',)
    fieldsets = [
        ('Bounty Information', {'fields': ['name', 'vault_tvl', 'max_bounty', 'total_paid']}),
        ('Program Overview', {'fields': ['vault_address', 'program_overview_html']}),
        ('Reward by Threat Level', {'fields': ['rewards_by_threat_level_html']}),
        ('Assetes in Scope', {'fields': ['optional_assets_in_scope_html']}),
        ('Impacts in Scope', {'fields': ['optional_impacts_in_scope_html']}),
        ('Out of Scope', {'fields': ['out_of_scope_html']}),
    ]
    list_display = ('name', 'vault_tvl', 'max_bounty', 'total_paid', 'last_updated', 'vault_address', 'program_overview_html', 'rewards_by_threat_level_html', 'optional_assets_in_scope_html', 'optional_impacts_in_scope_html', 'out_of_scope_html')
    inlines = [BountyRewardCategoryInline, BountyAssetInScopeInline, BountyImpactInScopeInline]

admin.site.register(Bounty, BountyAdmin)