<script>
    import { page } from "$app/stores";
</script>

<section>
    <h1>{$page.status} {$page.error?.message}</h1>
    <a href="/">Go back</a>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h1 {
        margin: 4px;
    }
</style>
