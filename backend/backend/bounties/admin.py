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
        ('Program Overview', {'fields': ['vault_address', 'program_overview']}),
        ('Reward by Threat Level', {'fields': ['rewards_by_threat_level_json']}),
        ('Assetes in Scope', {'fields': ['optional_assets_in_scope_json']}),
        ('Impacts in Scope', {'fields': ['optional_impacts_in_scope_json']}),
        ('Out of Scope', {'fields': ['out_of_scope_json']}),
    ]
    list_display = ('name', 'vault_tvl', 'max_bounty', 'total_paid', 'last_updated', 'vault_address', 'program_overview', 'rewards_by_threat_level_json', 'optional_assets_in_scope_json', 'optional_impacts_in_scope_json', 'out_of_scope_json')
    inlines = [BountyRewardCategoryInline, BountyAssetInScopeInline, BountyImpactInScopeInline]

admin.site.register(Bounty, BountyAdmin)