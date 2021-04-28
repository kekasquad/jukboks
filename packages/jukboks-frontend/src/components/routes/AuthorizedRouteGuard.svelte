<script>
  import { useNavigate, useLocation } from 'svelte-navigator';
  import { token } from '../../utils/stores';

  const navigate = useNavigate();
  const location = useLocation();

  $: if ($token) {
    navigate('/profile', {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if !$token}
  <slot />
{/if}
