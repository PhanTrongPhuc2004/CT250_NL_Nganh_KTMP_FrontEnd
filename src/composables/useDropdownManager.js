import { ref, onMounted, onBeforeUnmount } from "vue";

export function useDropdownManager() {
  const activeMenuId = ref(null);

  const toggleMenu = (id) => {
    activeMenuId.value = activeMenuId.value === id ? null : id;
  };

  const closeMenu = () => {
    activeMenuId.value = null;
  };

  const handleClickOutside = (e) => {
    const dropdowns = document.querySelectorAll("[data-dropdown-id]");
    let clickedInside = false;

    dropdowns.forEach((el) => {
      if (el.contains(e.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) closeMenu();
  };

  onMounted(() => document.addEventListener("click", handleClickOutside));
  onBeforeUnmount(() =>
    document.removeEventListener("click", handleClickOutside)
  );

  return { activeMenuId, toggleMenu, closeMenu };
}
