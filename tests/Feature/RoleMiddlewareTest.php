<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');

        $response = $this->get('/tenant/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_owner_can_access_admin_dashboard(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
        ]);

        $response = $this->actingAs($owner)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_tenant_cannot_access_admin_dashboard(): void
    {
        $tenant = User::factory()->create([
            'role' => 'tenant',
        ]);

        $response = $this->actingAs($tenant)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_tenant_can_access_tenant_dashboard(): void
    {
        $tenant = User::factory()->create([
            'role' => 'tenant',
        ]);

        $response = $this->actingAs($tenant)->get('/tenant/dashboard');
        $response->assertStatus(200);
    }

    public function test_owner_cannot_access_tenant_dashboard_directly(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
        ]);

        $response = $this->actingAs($owner)->get('/tenant/dashboard');
        $response->assertStatus(403);
    }

    public function test_general_dashboard_redirects_owner_to_admin_dashboard(): void
    {
        $owner = User::factory()->create([
            'role' => 'owner',
        ]);

        $response = $this->actingAs($owner)->get('/dashboard');
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_general_dashboard_redirects_tenant_to_tenant_dashboard(): void
    {
        $tenant = User::factory()->create([
            'role' => 'tenant',
        ]);

        $response = $this->actingAs($tenant)->get('/dashboard');
        $response->assertRedirect(route('tenant.dashboard'));
    }
}
