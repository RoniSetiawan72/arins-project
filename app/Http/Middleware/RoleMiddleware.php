<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Support 'owner' or 'admin' synonymously
        $userRole = $user->role;
        $allowedRoles = $roles;
        if (in_array('owner', $roles, true) && ! in_array('admin', $roles, true)) {
            $allowedRoles[] = 'admin';
        }

        if (! in_array($userRole, $allowedRoles, true)) {
            abort(403, 'Akses tidak diizinkan. Anda tidak memiliki hak akses untuk halaman ini.');
        }

        return $next($request);
    }
}
