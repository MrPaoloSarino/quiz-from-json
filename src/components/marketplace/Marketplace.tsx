import React, { useState } from 'react';
import { MarketplaceItem, mockMarketplaceItems } from './data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface MarketplaceProps {
    onInstall: (item: MarketplaceItem) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onInstall }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(mockMarketplaceItems.map(item => item.category)));

    const filteredItems = mockMarketplaceItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const handleInstall = (item: MarketplaceItem) => {
        toast.success(`Installing template: ${item.title}`);
        onInstall(item);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                    <p className="text-gray-500">Discover and install community-created quiz templates.</p>
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 pb-2 overflow-x-auto">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className="rounded-full"
                >
                    All
                </Button>
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                        className="rounded-full"
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <Card key={item.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant={item.price === 'Free' ? 'secondary' : 'default'} className="mb-2">
                                    {item.price}
                                </Badge>
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-3 h-3 fill-current mr-1" />
                                    <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                                </div>
                            </div>
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                <div>Author: <span className="font-medium text-gray-900">{item.author}</span></div>
                                <div>Category: <span className="font-medium text-gray-900">{item.category}</span></div>
                                <div>Downloads: <span className="font-medium text-gray-900">{item.downloads}</span></div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button className="w-full" onClick={() => handleInstall(item)}>
                                <Download className="mr-2 h-4 w-4" />
                                Get Template
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No templates found matching your search.</p>
                    <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>Clear filters</Button>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
