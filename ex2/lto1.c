#include <stdio.h>
#include "lto.h"

int
main() 
{
    double s = evaluate(3, 1, -2, 4);
    return (int)(s);
}