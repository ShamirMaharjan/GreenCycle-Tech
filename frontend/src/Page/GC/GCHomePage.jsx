import React from 'react';
import Header from "../../components/Header";
import GCSidebar from '../../components/GCSidebar';
import ArticleCard from '../../components/ArticleCard';
import Calendar from '../../components/Calendar';
import Reminders from '../../components/Reminders';

const recycleImage = "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=1000&auto=format&fit=crop";

const GCHomePage = () => {
    const articles = Array(6).fill({
        image: recycleImage,
        title: 'Recyclable waste'
    });

    return (
        <div className="flex min-h-screen bg-gray-100">
            <GCSidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="flex p-6 gap-6">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-6">ARTICLES ABOUT WASTE MANAGEMENT</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article, index) => (
                                <ArticleCard key={index} image={article.image} title={article.title} />
                            ))}
                        </div>
                    </div>

                    <div className="w-80">
                        <Calendar />
                        <Reminders />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GCHomePage;