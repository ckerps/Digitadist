export const getVisiblePages = (totalPages: number, currentPage: number) => {
  const maxVisible = 5;
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i);
    }
  } else if (currentPage >= totalPages - 2) {
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push('ellipsis');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
    pages.push(totalPages);
  }

  return pages;
};

export const itemsPerPage = process.env.NEXT_PUBLIC_CLIENTES_ITEMS_PER_PAGE
  ? +process.env.NEXT_PUBLIC_CLIENTES_ITEMS_PER_PAGE
  : 5;