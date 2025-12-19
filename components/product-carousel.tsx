"use client"

import * as React from "react"
import Link from "next/link"
import { Product } from "@/lib/dummy-data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ShoppingBag, Star, Eye } from "lucide-react"

interface ProductCarouselProps {
    products: Product[]
    title: string
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
    return (
        <div className="w-full py-10">
            <div className="flex items-center justify-between mb-8 px-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
                    <p className="text-muted-foreground mt-1">Discover our exclusive selection.</p>
                </div>
                <div className="hidden md:flex space-x-2">
                    {/* Custom navigation buttons can go here if needed, but we use defaults */}
                </div>
            </div>

            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-4">
                    {products.map((product) => (
                        <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                            <Link href={`/products/${product.id}`} className="group h-full block">
                                <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300 bg-white/40 backdrop-blur-md flex flex-col group-hover:-translate-y-2 rounded-xl">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-white rounded-t-xl group-hover:shadow-inner">
                                        <img
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Floating Badges */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                                            <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md shadow-sm">
                                                New
                                            </Badge>
                                            {product.stock < 10 && (
                                                <Badge variant="destructive" className="shadow-sm">
                                                    Low Stock
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-x-0 bottom-4 px-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex gap-2 justify-center">
                                            <Button size="sm" className="w-full bg-primary text-white shadow-lg backdrop-blur-md hover:bg-primary/90">
                                                <Eye className="w-4 h-4 mr-2" /> View
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-4 flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase border border-primary/20 px-2 py-0.5 rounded-full">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center text-amber-500 text-xs font-medium">
                                                <Star className="w-3 h-3 fill-current mr-1" />
                                                4.8
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
                                            {product.description}
                                        </p>
                                    </CardContent>

                                    {/* Footer */}
                                    <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground line-through opacity-70">₹{product.price * 1.2}</span>
                                            <span className="text-lg font-bold text-primary">₹{product.price}</span>
                                        </div>
                                        <Button
                                            size="icon"
                                            className="rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shadow-none hover:shadow-md"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="w-full flex justify-end gap-2 mt-4 pr-4">
                    <CarouselPrevious className="static translate-y-0 translate-x-0 hover:bg-primary hover:text-white transition-colors border-primary/20" />
                    <CarouselNext className="static translate-y-0 translate-x-0 hover:bg-primary hover:text-white transition-colors border-primary/20" />
                </div>
            </Carousel>
        </div>
    )
}
