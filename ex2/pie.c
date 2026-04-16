
#include <stdio.h>

int global_var;

int main() {
    printf("%p\n", (void *)&global_var);
    return 0;
}
